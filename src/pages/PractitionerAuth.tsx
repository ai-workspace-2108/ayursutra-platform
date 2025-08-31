import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function PractitionerAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [developmentOtp, setDevelopmentOtp] = useState("");

  // Get selected role from session storage
  const selectedRole = sessionStorage.getItem('selectedRole') || 'doctor';

  const postJson = async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Request failed (${response.status}):`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText || 'Request failed'}`);
    }

    return response.json();
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const result = await postJson("/api/auth/send-otp", {
        email: email.trim(),
        userRole: selectedRole,
      });

      if (result.success) {
        setSessionId(result.sessionId);
        setDevelopmentOtp(result.developmentOtp || "");
        setStep("otp");
        toast.success("OTP sent to your email!");
        
        // Log development OTP for testing
        if (result.developmentOtp) {
          console.log("Development OTP:", result.developmentOtp);
        }
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const result = await postJson("/api/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
        sessionId,
      });

      if (result.success) {
        setStep("success");
        toast.success("Email verified successfully!");
        
        // Redirect after a brief delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setStep("email");
    toast.info("You can now request a new OTP");
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
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img src="/logo.svg" alt="AyurSutra" className="h-8 w-8" />
                <span className="text-xl font-bold text-foreground">AyurSutra</span>
              </div>
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
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  {step === "email" && <Mail className="w-8 h-8 text-primary" />}
                  {step === "otp" && <Shield className="w-8 h-8 text-primary" />}
                  {step === "success" && <CheckCircle className="w-8 h-8 text-green-600" />}
                </div>
                
                <div>
                  <CardTitle className="text-2xl">
                    {step === "email" && "Verify Your Email"}
                    {step === "otp" && "Enter Verification Code"}
                    {step === "success" && "Verification Complete"}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {step === "email" && "We'll send you a verification code to confirm your identity"}
                    {step === "otp" && `Enter the 6-digit code sent to ${email}`}
                    {step === "success" && "Welcome to AyurSutra! Redirecting you to dashboard..."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === "email" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendOtp()}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSendOtp} 
                      disabled={isLoading || !email.trim()}
                      className="w-full"
                    >
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </Button>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        onKeyPress={(e) => e.key === "Enter" && handleVerifyOtp()}
                        disabled={isLoading}
                        maxLength={6}
                      />
                      {developmentOtp && (
                        <p className="text-sm text-muted-foreground">
                          Development OTP: <code className="bg-muted px-1 rounded">{developmentOtp}</code>
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      onClick={handleVerifyOtp} 
                      disabled={isLoading || otp.length !== 6}
                      className="w-full"
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm"
                      >
                        Didn't receive the code? Send again
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                  >
                    <div className="text-green-600">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">Email Verified Successfully!</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Taking you to your dashboard...
                      </p>
                    </div>
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