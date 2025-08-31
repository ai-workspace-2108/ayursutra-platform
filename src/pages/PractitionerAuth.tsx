import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type AuthStep = "email" | "otp" | "success";

const API_BASE = (import.meta.env.VITE_CONVEX_URL as string) || "";

// Helper: try multiple API bases to avoid 404s when env is misconfigured
const apiBases: string[] = [];
if (API_BASE) apiBases.push(API_BASE);
if (typeof window !== "undefined") {
  apiBases.push(window.location.origin);
}
const uniqueBases = Array.from(new Set(apiBases.map((b) => b.replace(/\/+$/, ""))));

async function postJson(path: string, payload: Record<string, unknown>) {
  let lastErr: any = null;
  for (const base of uniqueBases) {
    const url = `${base}${path}`;
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) return resp;
      // Save details and try next base
      const text = await resp.text().catch(() => "");
      lastErr = { status: resp.status, text, url };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("No API base available");
}

export default function PractitionerAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role") || sessionStorage.getItem("selectedRole") || "doctor";

  const [currentStep, setCurrentStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [developmentOtp, setDevelopmentOtp] = useState("");

  // Using HTTP endpoints; Convex mutation hooks not required

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await postJson("/api/auth/send-otp", {
        email,
        userRole: selectedRole,
      });

      const raw = await resp.text();
      if (!resp.ok) {
        console.error("Send OTP failed:", resp.status, raw);
        throw new Error(`Failed to send OTP (${resp.status})`);
      }

      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error("Send OTP invalid JSON:", raw);
        throw new Error("Unexpected server response while sending OTP");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setSessionId(data.sessionId);
      setDevelopmentOtp(data.developmentOtp || "");
      setCurrentStep("otp");
      setResendTimer(60);
      toast.success("OTP sent successfully!");

      if (data.developmentOtp) {
        console.log("Development OTP:", data.developmentOtp);
        toast.info(`Development OTP: ${data.developmentOtp}`, { duration: 10000 });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      const msg = error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const resp = await postJson("/api/auth/verify-otp", {
        email,
        otp,
        sessionId,
      });

      const raw = await resp.text();
      if (!resp.ok) {
        console.error("Verify OTP failed:", resp.status, raw);
        throw new Error(`Failed to verify OTP (${resp.status})`);
      }

      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error("Verify OTP invalid JSON:", raw);
        throw new Error("Unexpected server response while verifying OTP");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setCurrentStep("success");
      toast.success("Authentication successful!");

      if (data.userId) sessionStorage.setItem("userId", data.userId);
      if (data.role) sessionStorage.setItem("userRole", data.role);

      setTimeout(() => {
        // Keep flow simple and working: go to dashboard
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Verify OTP error:", error);
      const msg = error instanceof Error ? error.message : "Failed to verify OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setOtp("");
      handleSendOtp();
    }
  };

  const formatEmailDisplay = () => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    return `${localPart.slice(0, 2)}***@${domain}`;
  };

  const getRoleDisplayName = () => {
    return selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/role-selection")}
                className="hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <img src="/logo.svg" alt="AyurSutra" className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">AyurSutra</span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Step {currentStep === "email" ? "1" : currentStep === "otp" ? "2" : "3"} of 3:</span>
              <span className="text-foreground font-medium">
                {currentStep === "email" && "Email Verification"}
                {currentStep === "otp" && "OTP Verification"}
                {currentStep === "success" && "Authentication Complete"}
              </span>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {currentStep === "email" && <Mail className="w-8 h-8 text-primary" />}
                  {currentStep === "otp" && <Shield className="w-8 h-8 text-primary" />}
                  {currentStep === "success" && <CheckCircle className="w-8 h-8 text-green-600" />}
                </div>
                
                <div>
                  <CardTitle className="text-2xl">
                    {currentStep === "email" && `${getRoleDisplayName()} Login`}
                    {currentStep === "otp" && "Verify OTP"}
                    {currentStep === "success" && "Welcome!"}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {currentStep === "email" && "Enter your registered email address to continue"}
                    {currentStep === "otp" && `We've sent a 6-digit code to ${formatEmailDisplay()}`}
                    {currentStep === "success" && "Authentication successful. Redirecting..."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Email Step */}
                {currentStep === "email" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                      {email && !validateEmail(email) && (
                        <p className="text-sm text-destructive">
                          Please enter a valid email address
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleSendOtp}
                      disabled={!validateEmail(email) || isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </motion.div>
                )}

                {/* OTP Verification Step */}
                {currentStep === "otp" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Email Display with Edit Option */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {formatEmailDisplay()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("email")}
                        className="text-primary hover:text-primary/80"
                      >
                        Edit
                      </Button>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-foreground block text-center">
                        Enter 6-digit OTP
                      </label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={otp}
                          onChange={setOtp}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    {/* Resend Timer */}
                    <div className="text-center">
                      {resendTimer > 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Resend OTP in {resendTimer} seconds
                        </p>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={handleResendOtp}
                          className="text-primary hover:text-primary/80"
                        >
                          Resend OTP
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </motion.div>
                )}

                {/* Success Step */}
                {currentStep === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-muted-foreground">
                      Redirecting to your dashboard...
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}