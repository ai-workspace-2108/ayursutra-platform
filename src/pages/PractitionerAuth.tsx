import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Shield, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

type AuthStep = "phone" | "otp" | "success";

export default function PractitionerAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role") || sessionStorage.getItem("selectedRole") || "doctor";

  const [currentStep, setCurrentStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [developmentOtp, setDevelopmentOtp] = useState("");

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

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          userRole: selectedRole,
        }),
      });

      // Robust parsing: read text first; handle non-JSON and non-OK cleanly
      const raw = await response.text();
      if (!response.ok) {
        console.error("Send OTP failed:", response.status, response.statusText, raw);
        // Try to extract message from JSON; else show raw or generic
        let msg = raw;
        try {
          const parsed = JSON.parse(raw);
          msg = parsed?.message || msg;
        } catch {}
        toast.error(msg || `Failed to send OTP (${response.status})`);
        return;
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error("Send OTP: invalid JSON response:", raw);
        toast.error("Unexpected server response. Please try again.");
        return;
      }

      if (data.success) {
        setSessionId(data.sessionId);
        setDevelopmentOtp(data.developmentOtp || ""); // For development only
        setCurrentStep("otp");
        setResendTimer(60);
        toast.success("OTP sent successfully!");

        // Show development OTP in console and toast for testing
        if (data.developmentOtp) {
          console.log("Development OTP:", data.developmentOtp);
          toast.info(`Development OTP: ${data.developmentOtp}`, { duration: 10000 });
        }
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(error instanceof Error ? error.message : "Network error. Please try again.");
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
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          otp,
          sessionId,
        }),
      });

      // Robust parsing: read text first; handle non-JSON and non-OK cleanly
      const raw = await response.text();
      if (!response.ok) {
        console.error("Verify OTP failed:", response.status, response.statusText, raw);
        let msg = raw;
        try {
          const parsed = JSON.parse(raw);
          msg = parsed?.message || msg;
        } catch {}
        toast.error(msg || `Failed to verify OTP (${response.status})`);
        return;
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error("Verify OTP: invalid JSON response:", raw);
        toast.error("Unexpected server response. Please try again.");
        return;
      }

      if (data.success) {
        setCurrentStep("success");
        toast.success("Authentication successful!");

        // Store user info in session storage
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("userRole", data.role);

        // Redirect after a short delay
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(error instanceof Error ? error.message : "Network error. Please try again.");
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

  const formatPhoneDisplay = () => {
    return `${countryCode} ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
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
              <span>Step {currentStep === "phone" ? "1" : currentStep === "otp" ? "2" : "3"} of 3:</span>
              <span className="text-foreground font-medium">
                {currentStep === "phone" && "Phone Verification"}
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
                  {currentStep === "phone" && <Phone className="w-8 h-8 text-primary" />}
                  {currentStep === "otp" && <Shield className="w-8 h-8 text-primary" />}
                  {currentStep === "success" && <CheckCircle className="w-8 h-8 text-green-600" />}
                </div>
                
                <div>
                  <CardTitle className="text-2xl">
                    {currentStep === "phone" && `${getRoleDisplayName()} Login`}
                    {currentStep === "otp" && "Verify OTP"}
                    {currentStep === "success" && "Welcome!"}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {currentStep === "phone" && "Enter your registered phone number to continue"}
                    {currentStep === "otp" && `We've sent a 6-digit code to ${formatPhoneDisplay()}`}
                    {currentStep === "success" && "Authentication successful. Redirecting..."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Phone Number Step */}
                {currentStep === "phone" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <div className="flex space-x-2">
                        <div className="w-20">
                          <Input
                            value={countryCode}
                            disabled
                            className="text-center"
                          />
                        </div>
                        <Input
                          type="tel"
                          placeholder="XXXXX XXXXX"
                          value={phoneNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              setPhoneNumber(value);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                      {phoneNumber && !validatePhoneNumber(phoneNumber) && (
                        <p className="text-sm text-destructive">
                          Please enter a valid 10-digit mobile number
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleSendOtp}
                      disabled={!validatePhoneNumber(phoneNumber) || isLoading}
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
                    {/* Phone Number Display with Edit Option */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {formatPhoneDisplay()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep("phone")}
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