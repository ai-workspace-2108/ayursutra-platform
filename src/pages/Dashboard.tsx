import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="/logo.svg"
                alt="AyurSutra"
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <h1 className="text-xl font-semibold text-foreground">AyurSutra Dashboard</h1>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome to AyurSutra, {user?.name || "User"}!
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your gateway to authentic Ayurveda. Connect with verified practitioners and manage your wellness journey.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {user?.name || "Not set"}</p>
                    <p className="text-sm"><strong>Email:</strong> {user?.email || "Not set"}</p>
                    <p className="text-sm"><strong>Role:</strong> {user?.role || "User"}</p>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Find Practitioners</CardTitle>
                  <CardDescription>
                    Discover verified Ayurvedic practitioners near you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse our network of certified practitioners specializing in various Ayurvedic treatments.
                  </p>
                  <Button className="w-full">
                    Browse Practitioners
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Manage your upcoming and past appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your appointment history and schedule new consultations.
                  </p>
                  <Button className="w-full" variant="outline">
                    View Appointments
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Coming Soon Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center py-12"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">More Features Coming Soon</CardTitle>
                <CardDescription className="text-base">
                  We're continuously working to enhance your AyurSutra experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <h4 className="font-semibold">For Patients:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Advanced practitioner search</li>
                      <li>• Online consultations</li>
                      <li>• Treatment tracking</li>
                      <li>• Health records management</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">For Practitioners:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Practice management tools</li>
                      <li>• Patient communication</li>
                      <li>• Appointment scheduling</li>
                      <li>• Digital presence builder</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
