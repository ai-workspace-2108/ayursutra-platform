import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Add CORS headers and preflight handling
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Preflight for send-otp
http.route({
  path: "/api/auth/send-otp",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// Send OTP endpoint
http.route({
  path: "/api/auth/send-otp",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const { email, userRole } = body;

      if (!email || !userRole) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Email and user role are required" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Invalid email format" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }

      const result = await ctx.runMutation(internal.practitioner_auth_logic.generateAndStoreOtp, {
        email,
        role: userRole,
      });

      // In production, you would send email here using Resend or similar service
      console.log(`OTP for ${email}: ${result.otpCode}`);

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
          headers: { "Content-Type": "application/json", ...corsHeaders }
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
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
  }),
});

// Preflight for verify-otp
http.route({
  path: "/api/auth/verify-otp",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// Verify OTP endpoint
http.route({
  path: "/api/auth/verify-otp",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      const { email, otp, sessionId } = body;

      if (!email || !otp || !sessionId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Email, OTP, and session ID are required" 
          }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }

      const result = await ctx.runMutation(internal.practitioner_auth_logic.verifyAndAuthenticateOtp, {
        email,
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
          headers: { "Content-Type": "application/json", ...corsHeaders }
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
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
  }),
});

export default http;