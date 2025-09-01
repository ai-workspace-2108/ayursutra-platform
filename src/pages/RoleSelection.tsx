import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Hand, 
  Apple, 
  Check, 
  ArrowLeft 
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface Role {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string;
}

export default function RoleSelection() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: Role[] = [
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage patients, prescribe treatments, and monitor therapy progress with comprehensive patient management tools.',
      icon: Stethoscope,
      features: 'Prescription tracking, therapy planning'
    },
    {
      id: 'therapist', 
      title: 'Therapist',
      description: 'Streamline therapy scheduling, manage sessions, and track patient progress with specialized therapy tools.',
      icon: Hand,
      features: 'Session management, patient progress'
    },
    {
      id: 'dietician',
      title: 'Dietician', 
      description: 'Create personalized nutrition plans, generate diet recommendations, and track nutrient intake for patients.',
      icon: Apple,
      features: 'Diet plan generation, nutrient tracking'
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Store role in session storage for later use
      sessionStorage.setItem('selectedRole', selectedRole);
      
      // Navigate based on selected role
      if (selectedRole === 'doctor') {
        // Doctors go directly to dashboard
        navigate('/dashboard');
      } else {
        // Other roles go to practitioner auth for verification
        navigate('/practitioner-auth');
      }
    }
  };

  // Add verification: redirect unauthenticated users to /auth
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Loading guard while auth state is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Checking your session...</div>
      </div>
    );
  }

  // If not authenticated (during brief transition), show a minimal friendly prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

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
            {/* Left: Back button and Logo */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-16"
          >
            {/* Header Section */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Choose Your Professional Role
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Select your specialization to access personalized features
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {roles.map((role, index) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                const isOtherSelected = selectedRole && selectedRole !== role.id;

                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card 
                      className={`
                        h-80 cursor-pointer transition-all duration-300 hover:shadow-xl
                        ${isSelected 
                          ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                        }
                        ${isOtherSelected ? 'opacity-60' : 'opacity-100'}
                      `}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      {/* Selected Checkmark Overlay */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-4 right-4 z-10"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </motion.div>
                      )}

                      <CardHeader className="text-center space-y-4">
                        {/* Icon */}
                        <div className={`
                          mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300
                          ${isSelected 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                          }
                        `}>
                          <IconComponent className="w-10 h-10" />
                        </div>

                        {/* Title */}
                        <CardTitle className="text-2xl text-foreground">
                          {role.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4 text-center">
                        {/* Description */}
                        <CardDescription className="text-base leading-relaxed">
                          {role.description}
                        </CardDescription>

                        {/* Features */}
                        <div className="text-sm text-primary font-medium">
                          {role.features}
                        </div>

                        {/* Select Button */}
                        <Button 
                          variant={isSelected ? "default" : "outline"}
                          className="w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelect(role.id);
                          }}
                        >
                          {isSelected ? 'Selected' : 'Select Role'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Continue Button */}
            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <Button 
                  size="lg" 
                  onClick={handleContinue}
                  className="px-12 py-6 text-lg"
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}