import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  LogOut, 
  User, 
  Users, 
  Calendar, 
  Activity,
  Stethoscope,
  Apple,
  Hand,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type DashboardView = "overview" | "therapist-management" | "dietitian-management" | "patient-management";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  // Fetch dashboard data
  const therapistStats = useQuery(api.therapists.getTherapistStats);
  const patients = useQuery(api.patients.getPatientsByDoctor, 
    user?._id ? { doctorId: user._id } : "skip"
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarItems = [
    {
      id: "overview" as DashboardView,
      label: "Overview",
      icon: Activity,
      description: "Dashboard overview"
    },
    {
      id: "therapist-management" as DashboardView,
      label: "Therapist Management",
      icon: Hand,
      description: "Manage therapy sessions"
    },
    {
      id: "dietitian-management" as DashboardView,
      label: "Dietitian Management", 
      icon: Apple,
      description: "Manage nutrition plans"
    },
    {
      id: "patient-management" as DashboardView,
      label: "Patient Management",
      icon: Users,
      description: "Register and manage patients"
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="stat-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active patient records
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="stat-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Therapists</CardTitle>
              <Hand className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{therapistStats?.available || 0}</div>
              <p className="text-xs text-muted-foreground">
                Out of {therapistStats?.total || 0} total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="stat-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{therapistStats?.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Therapy sessions completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="stat-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {therapistStats?.averageRating ? therapistStats.averageRating.toFixed(1) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Therapist ratings
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView("patient-management")}
              >
                <Plus className="h-6 w-6" />
                <span>Register New Patient</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView("therapist-management")}
              >
                <Calendar className="h-6 w-6" />
                <span>Schedule Therapy</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => setActiveView("dietitian-management")}
              >
                <Apple className="h-6 w-6" />
                <span>Assign Dietitian</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System is running smoothly</p>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Dashboard ready for use</p>
                  <p className="text-xs text-muted-foreground">Start managing your practice</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return renderOverview();
      case "therapist-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Therapist Management</h2>
                <p className="text-muted-foreground">Manage therapy sessions and assignments</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Hand className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Therapist Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature is being implemented. You'll be able to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                    <li>• View therapist availability and schedules</li>
                    <li>• Assign patients to therapists</li>
                    <li>• Track therapy session history</li>
                    <li>• Manage cancellations and rescheduling</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "dietitian-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Dietitian Management</h2>
                <p className="text-muted-foreground">Manage nutrition plans and dietitian assignments</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Apple className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Dietitian Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature is being implemented. You'll be able to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                    <li>• View available dietitians and their capacity</li>
                    <li>• Assign patients to dietitians</li>
                    <li>• Transfer patient details for nutrition planning</li>
                    <li>• Track dietary progress and outcomes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "patient-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Patient Management</h2>
                <p className="text-muted-foreground">Register new patients and manage existing records</p>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Patient Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature is being implemented. You'll be able to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto">
                    <li>• Register new patients with complete OPD forms</li>
                    <li>• Conduct Ayurvedic body type assessments</li>
                    <li>• Calculate BMI and health metrics</li>
                    <li>• Manage patient profiles and medical history</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen dashboard-gradient"
    >
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="/logo.svg"
                alt="AyurSutra"
                className="h-8 w-8 cursor-pointer"
                onClick={() => navigate("/")}
              />
              <div>
                <h1 className="text-xl font-semibold text-foreground">AyurSutra</h1>
                <p className="text-xs text-muted-foreground">Doctor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name || "Doctor"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-64 min-h-screen sidebar-nav border-r"
        >
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <IconComponent className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className={`text-xs ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {item.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}