import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  LogOut, 
  User, 
  Users, 
  Calendar as CalendarIcon, 
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
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { generateTimeSlots, formatDate } from "@/lib/utils";
import { format } from "date-fns";

type DashboardView = "overview" | "therapist-management" | "dietitian-management" | "patient-management";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>("therapist-management");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:00-10:00");
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const createSession = useMutation(api.therapists.createTherapySession);
  const cancelSession = useMutation(api.therapists.cancelTherapySession);

  // Fetch dashboard data
  const therapistStats = useQuery(api.therapists.getTherapistStats);
  const patients = useQuery(api.patients.getPatientsByDoctor, 
    user?._id ? { doctorId: user._id } : "skip"
  );
  const allTherapists = useQuery(api.therapists.getAllTherapists);
  const slotOccupancy = useQuery(
    api.therapists.getSlotOccupancy,
    { date: format(selectedDate, "yyyy-MM-dd"), timeSlot: selectedTimeSlot }
  );
  const selectedTherapistHistory = useQuery(
    api.therapists.getTherapistSessionHistory,
    selectedTherapistId ? { therapistId: selectedTherapistId as any, limit: 50 } : "skip"
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
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
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
                <CalendarIcon className="h-6 w-6" />
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

  const renderTherapistManagement = () => {
    const totalTherapists = allTherapists?.length || 0;
    const busyCount = slotOccupancy?.busyCount || 0;
    const freeCount = Math.max((slotOccupancy?.freeCount ?? (totalTherapists - busyCount)), 0);

    const timeSlots = generateTimeSlots();

    const handleAssign = async () => {
      try {
        if (!user?._id) {
          toast("Please sign in again.");
          return;
        }
        if (!selectedPatientId) {
          toast("Select a patient first.");
          return;
        }
        if (!selectedTherapistId) {
          toast("Select a therapist to assign.");
          return;
        }
        await createSession({
          patientId: selectedPatientId as any,
          therapistId: selectedTherapistId as any,
          doctorId: user._id,
          sessionDate: format(selectedDate, "yyyy-MM-dd"),
          timeSlot: selectedTimeSlot,
          sessionType: "Therapy Session",
          notes: undefined,
        });
        toast("Session scheduled successfully.");
      } catch (e: any) {
        toast(e.message || "Failed to schedule session.");
      }
    };

    const handleCancel = async (sessionId: string) => {
      try {
        await cancelSession({ sessionId: sessionId as any, reason: "Cancelled by doctor" });
        toast("Session cancelled.");
      } catch (e: any) {
        toast(e.message || "Failed to cancel.");
      }
    };

    const busyTherapistIds = new Set(slotOccupancy?.busyTherapistIds?.map(String) || []);

    return (
      <div className="space-y-6">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Therapist Management</h2>
            <p className="text-muted-foreground">Count, Work Assign, History, and Cancellations</p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Therapists</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTherapists}</div>
              <p className="text-xs text-muted-foreground">Clinic capacity</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available (Selected Slot)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{freeCount}</div>
              <p className="text-xs text-muted-foreground">
                {format(selectedDate, "PP")} • {selectedTimeSlot}
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Busy (Selected Slot)</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{busyCount}</div>
              <p className="text-xs text-muted-foreground">Currently booked</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Break/Other</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">0</div>
              <p className="text-xs text-muted-foreground">Not tracked yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Work Assign */}
        <Card>
          <CardHeader>
            <CardTitle>Work Assign</CardTitle>
            <CardDescription>Select date/time, patient and therapist, then schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  showOutsideDays
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">Time Slot</label>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="text-sm font-medium mt-4 block">Patient</label>
                <Select
                  value={selectedPatientId}
                  onValueChange={setSelectedPatientId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {(patients || []).map((p) => (
                      <SelectItem key={String(p._id)} value={String(p._id)}>
                        {p.name} • {p.age} • {p.gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-6">
                  <Button className="w-full" onClick={handleAssign}>
                    Assign Session
                  </Button>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Summary: Total {totalTherapists}, Free {freeCount}, Busy {busyCount}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Selected Date</label>
                <Input readOnly value={format(selectedDate, "PP")} />
                <label className="text-sm font-medium mt-4">Selected Slot</label>
                <Input readOnly value={selectedTimeSlot} />
              </div>
            </div>

            {/* Therapist Grid */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Therapists</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(allTherapists || []).map((t) => {
                  const isBusy = busyTherapistIds.has(String(t._id));
                  const isSelected = selectedTherapistId === String(t._id);
                  return (
                    <Card
                      key={String(t._id)}
                      className={`card-hover ${isSelected ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{t.name}</CardTitle>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              isBusy
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {isBusy ? "Busy" : "Free"}
                          </span>
                        </div>
                        <CardDescription className="text-xs">
                          {t.specialization.join(", ")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-xs text-muted-foreground">
                          Sessions: {t.totalSessions} • Rating: {t.rating ?? "N/A"}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={isSelected ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTherapistId(String(t._id))}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTherapistId(String(t._id))}
                          >
                            View History
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment History + Cancellation */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment History</CardTitle>
            <CardDescription>
              {selectedTherapistId ? "Recent sessions for selected therapist" : "Select a therapist to view history"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTherapistId ? (
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(selectedTherapistHistory || []).map((s) => (
                      <TableRow key={String(s._id)}>
                        <TableCell>{formatDate(s.sessionDate)}</TableCell>
                        <TableCell>{s.timeSlot}</TableCell>
                        <TableCell>{s.patient?.name || "Unknown"}</TableCell>
                        <TableCell className="capitalize">{s.status}</TableCell>
                        <TableCell>{s.sessionType}</TableCell>
                        <TableCell className="space-x-2">
                          {s.status === "scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(String(s._id))}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No therapist selected.</div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return renderOverview();
      case "therapist-management":
        return renderTherapistManagement();
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