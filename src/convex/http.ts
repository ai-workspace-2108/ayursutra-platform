import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Send OTP endpoint
http.route({
  path: "/api/auth/send-otp",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const { phoneNumber, userRole } = body;

      if (!phoneNumber || !userRole) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Phone number and user role are required" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^\+91[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Invalid phone number format" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      const result = await ctx.runMutation(internal.practitioner_auth_logic.generateAndStoreOtp, {
        phoneNumber,
        role: userRole,
      });

      // In production, you would send SMS here using Twilio or similar service
      console.log(`OTP for ${phoneNumber}: ${result.otpCode}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "OTP sent successfully",
          sessionId: result.sessionId,
          expiresIn: 300,
          // Remove this in production - only for development
          developmentOtp: result.otpCode,
        }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Send OTP error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to send OTP" 
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

// Verify OTP endpoint
http.route({
  path: "/api/auth/verify-otp",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const { phoneNumber, otp, sessionId } = body;

      if (!phoneNumber || !otp || !sessionId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Phone number, OTP, and session ID are required" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      const result = await ctx.runMutation(internal.practitioner_auth_logic.verifyAndAuthenticateOtp, {
        phoneNumber,
        otpCode: otp,
        sessionId,
      });

      const redirectTo = result.isNewUser ? "/onboarding" : "/dashboard";

      return new Response(
        JSON.stringify({
          success: true,
          userExists: !result.isNewUser,
          userId: result.userId,
          role: result.role,
          redirectTo,
        }),
        { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Verify OTP error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: error instanceof Error ? error.message : "Failed to verify OTP" 
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }),
});

export default http;