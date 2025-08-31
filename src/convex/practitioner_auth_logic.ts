import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generate and store OTP for email
export const generateAndStoreOtp = internalMutation({
  args: {
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 5 minutes from now
    const expiresAt = Date.now() + 5 * 60 * 1000;
    
    // Clean up any existing OTP sessions for this email
    const existingSessions = await ctx.db
      .query("otp_sessions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    
    for (const session of existingSessions) {
      await ctx.db.delete(session._id);
    }
    
    // Create new OTP session
    const sessionId = await ctx.db.insert("otp_sessions", {
      email: args.email,
      otpCode,
      expiresAt,
      isVerified: false,
      attemptsCount: 0,
      role: args.role,
    });
    
    return {
      sessionId,
      otpCode, // In production, this would not be returned - OTP would be sent via email
      expiresAt,
    };
  },
});

// Verify OTP and authenticate user
export const verifyAndAuthenticateOtp = internalMutation({
  args: {
    email: v.string(),
    otpCode: v.string(),
    sessionId: v.id("otp_sessions"),
  },
  handler: async (ctx, args) => {
    // Get OTP session
    const session = await ctx.db.get(args.sessionId);
    
    if (!session) {
      throw new Error("Invalid session");
    }
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      throw new Error("OTP expired");
    }
    
    // Check if already verified
    if (session.isVerified) {
      throw new Error("OTP already used");
    }
    
    // Check attempts count
    if (session.attemptsCount >= 5) {
      throw new Error("Too many attempts");
    }
    
    // Increment attempts
    await ctx.db.patch(args.sessionId, {
      attemptsCount: session.attemptsCount + 1,
    });
    
    // Verify OTP
    if (session.otpCode !== args.otpCode) {
      throw new Error("Invalid OTP");
    }
    
    // Mark session as verified
    await ctx.db.patch(args.sessionId, {
      isVerified: true,
    });
    
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
    
    let userId: Id<"users">;
    let isNewUser = false;
    
    if (existingUser) {
      // Update existing user's role
      await ctx.db.patch(existingUser._id, {
        role: session.role as any,
      });
      userId = existingUser._id;
    } else {
      // Create new user
      userId = await ctx.db.insert("users", {
        email: args.email,
        role: session.role as any,
        isAnonymous: false,
      });
      isNewUser = true;
    }
    
    return {
      userId,
      isNewUser,
      role: session.role,
    };
  },
});

// Get user by email
export const getUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
  },
});