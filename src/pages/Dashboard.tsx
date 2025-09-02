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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DashboardView = "overview" | "therapist-management" | "dietitian-management" | "patient-management";

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<DashboardView>("therapist-management");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("09:00-10:00");
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [dietitianSearch, setDietitianSearch] = useState<string>("");
  const [selectedPatientForDietitianId, setSelectedPatientForDietitianId] = useState<string>("");
  const [selectedDietitianIdDM, setSelectedDietitianIdDM] = useState<string>("");
  const [dietitianNotes, setDietitianNotes] = useState<string>("");
  const [profilePatientId, setProfilePatientId] = useState<string | null>(null);
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    emergencyContact: "",
    height: "",
    weight: "",
    bloodPressure: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    prakriti: "",
    vikriti: "",
    dominantDosha: "",
    constitutionType: "",
    healthGoals: "",
    workSchedule: "",
    preferredSessionTime: "",
  });

  const createSession = useMutation(api.therapists.createTherapySession);
  const cancelSession = useMutation(api.therapists.cancelTherapySession);
  const createDietitianAssignment = useMutation(api.dietitians.createDietitianAssignment);
  const registerPatient = useMutation(api.patients.registerPatient);

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
  const availableDietitians = useQuery(api.dietitians.getAvailableDietitians);

  const selectedPatientForDietitian = (patients || []).find(
    (p) => String(p._id) === selectedPatientForDietitianId
  );
  const selectedDietitian = (availableDietitians || []).find(
    (d) => String(d._id) === selectedDietitianIdDM
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
    const selectedTherapistName =
      (allTherapists || []).find((t) => String(t._id) === selectedTherapistId)?.name || "";

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

  const renderDietitianManagement = () => {
    const filteredPatients = (patients || []).filter((p) => {
      if (!dietitianSearch.trim()) return true;
      const s = dietitianSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.contact.toLowerCase().includes(s) ||
        (p.email || "").toLowerCase().includes(s)
      );
    });

    const profilePatient = (patients || []).find((p) => String(p._id) === profilePatientId);

    const handleAssignDietitian = async () => {
      try {
        if (!user?._id) {
          toast("Please sign in again.");
          return;
        }
        if (!selectedPatientForDietitianId) {
          toast("Select a patient first.");
          return;
        }
        if (!selectedDietitianIdDM) {
          toast("Select a dietitian.");
          return;
        }

        await createDietitianAssignment({
          patientId: selectedPatientForDietitianId as any,
          dietitianId: selectedDietitianIdDM as any,
          doctorId: user._id,
          notes: dietitianNotes || undefined,
        });
        toast("Patient details sent to dietitian.");
        setDietitianNotes("");
      } catch (e: any) {
        toast(e.message || "Failed to assign dietitian.");
      }
    };

    return (
      <div className="space-y-6">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dietitian Management</h2>
            <p className="text-muted-foreground">
              Patient selection, Dietitian assignment, and information transfer
            </p>
          </div>
        </div>

        {/* Top controls */}
        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <CardDescription>
              Choose a patient to assign to a dietitian
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search patients by name, phone, or email"
                  value={dietitianSearch}
                  onChange={(e) => setDietitianSearch(e.target.value)}
                />
              </div>
              <div>
                <Select
                  value={selectedPatientForDietitianId}
                  onValueChange={setSelectedPatientForDietitianId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPatients.map((p) => {
                      const assigned =
                        !!p.assignedDietitianId || !!p.assignedTherapistId;
                      return (
                        <SelectItem key={String(p._id)} value={String(p._id)}>
                          {p.name} • {p.age} • {p.gender}
                          {assigned ? " • Assigned" : " • Unassigned"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Patient Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((p) => {
                const isSelected =
                  selectedPatientForDietitianId === String(p._id);
                const isAssigned = !!p.assignedDietitianId;
                return (
                  <Card
                    key={String(p._id)}
                    className={`card-hover ${isSelected ? "ring-2 ring-primary" : ""}`}
                  >
                    <CardHeader className="space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            isAssigned
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {isAssigned ? "Assigned" : "Unassigned"}
                        </span>
                      </div>
                      <CardDescription className="text-xs">
                        Age {p.age} • {p.gender} • {p.contact}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        BMI: {p.bmi} ({p.bmiCategory}) • Dosha: {p.dominantDosha}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isSelected ? "secondary" : "outline"}
                          size="sm"
                          onClick={() =>
                            setSelectedPatientForDietitianId(String(p._id))
                          }
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setProfilePatientId(String(p._id))}
                        >
                          View Full Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dietitians */}
        <Card>
          <CardHeader>
            <CardTitle>Available Dietitians</CardTitle>
            <CardDescription>
              Select a dietitian to assign the patient to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(availableDietitians || []).map((d) => {
                const isSelected = selectedDietitianIdDM === String(d._id);
                const capacity = `${d.currentPatientCount}/${d.maxPatientsPerDay}`;
                const capacityPct =
                  Math.min(
                    100,
                    Math.round((d.currentPatientCount / d.maxPatientsPerDay) * 100)
                  ) || 0;

                return (
                  <Card
                    key={String(d._id)}
                    className={`card-hover ${isSelected ? "ring-2 ring-primary" : ""}`}
                  >
                    <CardHeader className="space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{d.name}</CardTitle>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            d.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {d.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <CardDescription className="text-xs">
                        {d.specialization.join(", ")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Experience: {d.experience} yrs • Rating: {d.rating ?? "N/A"}
                      </div>
                      <div className="text-xs">
                        Capacity: {capacity} ({capacityPct}%)
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isSelected ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDietitianIdDM(String(d._id))}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDietitianIdDM(String(d._id))}
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Profile Modal */}
        <Dialog open={!!profilePatientId} onOpenChange={(open) => !open && setProfilePatientId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Patient Profile</DialogTitle>
              <DialogDescription>Full details for the selected patient</DialogDescription>
            </DialogHeader>
            {profilePatient ? (
              <div className="space-y-3 text-sm">
                <div className="font-medium text-base">{profilePatient.name}</div>
                <div className="text-muted-foreground">
                  {profilePatient.age} • {profilePatient.gender}
                </div>
                <div>Contact: {profilePatient.contact}</div>
                {profilePatient.email && <div>Email: {profilePatient.email}</div>}
                <div>BMI: {profilePatient.bmi} ({profilePatient.bmiCategory})</div>
                <div>Dominant Dosha: {profilePatient.dominantDosha}</div>
                <div>Prakriti: {profilePatient.prakriti}</div>
                {profilePatient.vikriti && <div>Vikriti: {profilePatient.vikriti}</div>}
                <div>
                  Health Goals:{" "}
                  {profilePatient.healthGoals && profilePatient.healthGoals.length
                    ? profilePatient.healthGoals.join(", ")
                    : "—"}
                </div>
                <div>
                  Allergies:{" "}
                  {profilePatient.allergies && profilePatient.allergies.length
                    ? profilePatient.allergies.join(", ")
                    : "None"}
                </div>
                <div>Address: {profilePatient.address}</div>
                <div>Emergency Contact: {profilePatient.emergencyContact}</div>
                {profilePatient.bloodPressure && <div>BP: {profilePatient.bloodPressure}</div>}
                <div>Height: {profilePatient.height} cm • Weight: {profilePatient.weight} kg</div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No patient selected.</div>
            )}
          </DialogContent>
        </Dialog>

        {/* Transfer details / Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Send Patient Details</CardTitle>
            <CardDescription>
              Review summary and send to the selected dietitian
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Patient Summary */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Summary</CardTitle>
                    <CardDescription>
                      Key health metrics and Ayurvedic profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedPatientForDietitian ? (
                      <>
                        <div className="font-medium">{selectedPatientForDietitian.name}</div>
                        <div className="text-muted-foreground">
                          {selectedPatientForDietitian.age} • {selectedPatientForDietitian.gender}
                        </div>
                        <div>
                          BMI: {selectedPatientForDietitian.bmi} (
                          {selectedPatientForDietitian.bmiCategory})
                        </div>
                        <div>
                          Dominant Dosha: {selectedPatientForDietitian.dominantDosha}
                        </div>
                        <div className="text-muted-foreground">
                          Goals: {selectedPatientForDietitian.healthGoals.join(", ")}
                        </div>
                        <div className="text-muted-foreground">
                          Allergies:{" "}
                          {selectedPatientForDietitian.allergies.length
                            ? selectedPatientForDietitian.allergies.join(", ")
                            : "None"}
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground">No patient selected.</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Dietitian Summary */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-base">Dietitian</CardTitle>
                    <CardDescription>Profile overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {selectedDietitian ? (
                      <>
                        <div className="font-medium">{selectedDietitian.name}</div>
                        <div className="text-muted-foreground">
                          {selectedDietitian.specialization.join(", ")}
                        </div>
                        <div>
                          Capacity: {selectedDietitian.currentPatientCount}/
                          {selectedDietitian.maxPatientsPerDay}
                        </div>
                        <div>Experience: {selectedDietitian.experience} yrs</div>
                        <div>Rating: {selectedDietitian.rating ?? "N/A"}</div>
                      </>
                    ) : (
                      <div className="text-muted-foreground">No dietitian selected.</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes and Action */}
              <div className="lg:col-span-1 space-y-3">
                <label className="text-sm font-medium">Special Instructions / Notes</label>
                <Input
                  placeholder="Add specific concerns, therapy coordination notes, etc."
                  value={dietitianNotes}
                  onChange={(e) => setDietitianNotes(e.target.value)}
                />
                <Button className="w-full mt-2" onClick={handleAssignDietitian}>
                  Send Details to Dietitian
                </Button>
                <div className="text-xs text-muted-foreground">
                  Assignment respects real-time capacity. If dietitian is at capacity, the
                  operation will be prevented.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPatientManagement = () => {
    const handleChange = (field: keyof typeof patientForm, value: string) => {
      setPatientForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
      try {
        // Guard: ensure auth is ready and user has a valid session
        if (authLoading) {
          toast("Authentication is loading. Please wait a moment...");
          return;
        }
        if (!isAuthenticated || !user?._id) {
          toast("Your session is not active. Please sign in again.");
          return;
        }

        // Basic required validation
        const requiredFields = [
          "name","age","gender","contact","address","emergencyContact",
          "height","weight","prakriti","dominantDosha","constitutionType",
          "healthGoals","workSchedule","preferredSessionTime"
        ] as const;

        for (const f of requiredFields) {
          const v = patientForm[f];
          if (!v || String(v).trim() === "") {
            toast(`Please fill ${f}`);
            return;
          }
        }

        // Helper to map comma separated strings -> trimmed array
        const toArray = (s: string): string[] =>
          s
            .split(",")
            .map((x) => x.trim())
            .filter((x) => x.length > 0);

        await registerPatient({
          name: patientForm.name.trim(),
          age: Number(patientForm.age),
          gender: patientForm.gender as any,
          contact: patientForm.contact.trim(),
          email: patientForm.email.trim() || undefined,
          address: patientForm.address.trim(),
          emergencyContact: patientForm.emergencyContact.trim(),
          height: Number(patientForm.height),
          weight: Number(patientForm.weight),
          bloodPressure: patientForm.bloodPressure.trim() || undefined,
          medicalHistory: toArray(patientForm.medicalHistory),
          currentMedications: toArray(patientForm.currentMedications),
          allergies: toArray(patientForm.allergies),
          prakriti: patientForm.prakriti as any,
          vikriti: (patientForm.vikriti.trim() ? (patientForm.vikriti as any) : undefined),
          dominantDosha: patientForm.dominantDosha.trim(),
          constitutionType: patientForm.constitutionType.trim(),
          healthGoals: toArray(patientForm.healthGoals),
          workSchedule: patientForm.workSchedule.trim(),
          preferredSessionTime: patientForm.preferredSessionTime.trim(),
          doctorId: user._id,
        });

        toast("Patient registered successfully.");

        // BEGIN: Mirror saved patient data into localStorage
        try {
          const heightNum = Number(patientForm.height);
          const weightNum = Number(patientForm.weight);
          const heightInMeters = heightNum / 100;
          const bmiCalc = weightNum && heightInMeters ? (weightNum / (heightInMeters * heightInMeters)) : 0;
          const bmiRounded = Math.round(bmiCalc * 10) / 10;
          let bmiCategory = "";
          if (bmiRounded < 18.5) bmiCategory = "Underweight";
          else if (bmiRounded < 25) bmiCategory = "Normal";
          else if (bmiRounded < 30) bmiCategory = "Overweight";
          else bmiCategory = "Obese";

          const patientLocal = {
            // Personal Information
            name: patientForm.name.trim(),
            age: Number(patientForm.age),
            gender: patientForm.gender,
            contact: patientForm.contact.trim(),
            email: patientForm.email.trim() || undefined,
            address: patientForm.address.trim(),
            emergencyContact: patientForm.emergencyContact.trim(),

            // Medical
            height: heightNum,
            weight: weightNum,
            bloodPressure: patientForm.bloodPressure.trim() || undefined,
            medicalHistory: toArray(patientForm.medicalHistory),
            currentMedications: toArray(patientForm.currentMedications),
            allergies: toArray(patientForm.allergies),

            // Ayurvedic
            prakriti: patientForm.prakriti,
            vikriti: (patientForm.vikriti.trim() ? patientForm.vikriti : undefined),
            dominantDosha: patientForm.dominantDosha.trim(),
            constitutionType: patientForm.constitutionType.trim(),

            // Goals & Schedule
            healthGoals: toArray(patientForm.healthGoals),
            workSchedule: patientForm.workSchedule.trim(),
            preferredSessionTime: patientForm.preferredSessionTime.trim(),

            // Derived
            bmi: bmiRounded,
            bmiCategory,
            isActive: true,

            // Links
            doctorId: String(user._id),
            assignedTherapistId: undefined,
            assignedDietitianId: undefined,
          };

          const key = `patients_${String(user._id)}`;
          const existingRaw = localStorage.getItem(key);
          const existingArr: Array<any> = existingRaw ? JSON.parse(existingRaw) : [];
          const updatedArr: Array<any> = [patientLocal, ...existingArr];

          localStorage.setItem(key, JSON.stringify(updatedArr));
          localStorage.setItem("last_registered_patient", JSON.stringify(patientLocal));
        } catch {
          // non-blocking localStorage failure; no-op
        }
        // END: Mirror saved patient data into localStorage

        // Reset form
        setPatientForm({
          name: "",
          age: "",
          gender: "",
          contact: "",
          email: "",
          address: "",
          emergencyContact: "",
          height: "",
          weight: "",
          bloodPressure: "",
          medicalHistory: "",
          currentMedications: "",
          allergies: "",
          prakriti: "",
          vikriti: "",
          dominantDosha: "",
          constitutionType: "",
          healthGoals: "",
          workSchedule: "",
          preferredSessionTime: "",
        });
      } catch (e: any) {
        toast(e.message || "Failed to register patient.");
      }
    };

    const prakritiOptions = [
      { value: "vata", label: "Vata" },
      { value: "pitta", label: "Pitta" },
      { value: "kapha", label: "Kapha" },
      { value: "vata_pitta", label: "Vata-Pitta" },
      { value: "pitta_kapha", label: "Pitta-Kapha" },
      { value: "vata_kapha", label: "Vata-Kapha" },
      { value: "tridosha", label: "Tridosha" },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Patient Management</h2>
            <p className="text-muted-foreground">Register new patients and manage existing records</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Patient OPD Registration</CardTitle>
            <CardDescription>Complete the patient intake details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input value={patientForm.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-medium">Age</label>
                <Input type="number" value={patientForm.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="35" />
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <Select value={patientForm.gender} onValueChange={(v) => handleChange("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Contact</label>
                <Input value={patientForm.contact} onChange={(e) => handleChange("contact", e.target.value)} placeholder="+91-XXXXXXXXXX" />
              </div>
              <div>
                <label className="text-sm font-medium">Email (optional)</label>
                <Input type="email" value={patientForm.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="name@email.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Emergency Contact</label>
                <Input value={patientForm.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} placeholder="+91-XXXXXXXXXX" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Address</label>
                <Input value={patientForm.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Full address" />
              </div>
            </div>

            {/* Medical Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Height (cm)</label>
                <Input type="number" value={patientForm.height} onChange={(e) => handleChange("height", e.target.value)} placeholder="175" />
              </div>
              <div>
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input type="number" value={patientForm.weight} onChange={(e) => handleChange("weight", e.target.value)} placeholder="70" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Blood Pressure (optional)</label>
                <Input value={patientForm.bloodPressure} onChange={(e) => handleChange("bloodPressure", e.target.value)} placeholder="120/80" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Medical History (comma separated)</label>
                <Textarea value={patientForm.medicalHistory} onChange={(e) => handleChange("medicalHistory", e.target.value)} placeholder="Hypertension, Diabetes" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Current Medications (comma separated)</label>
                <Textarea value={patientForm.currentMedications} onChange={(e) => handleChange("currentMedications", e.target.value)} placeholder="Metformin, Amlodipine" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Allergies (comma separated)</label>
                <Textarea value={patientForm.allergies} onChange={(e) => handleChange("allergies", e.target.value)} placeholder="Peanuts, Dust" />
              </div>
            </div>

            {/* Ayurvedic Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Prakriti</label>
                <Select value={patientForm.prakriti} onValueChange={(v) => handleChange("prakriti", v)}>
                  <SelectTrigger><SelectValue placeholder="Select prakriti" /></SelectTrigger>
                  <SelectContent>
                    {prakritiOptions.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Vikriti (optional)</label>
                <Select value={patientForm.vikriti} onValueChange={(v) => handleChange("vikriti", v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Select vikriti" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {prakritiOptions.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Dominant Dosha</label>
                <Input value={patientForm.dominantDosha} onChange={(e) => handleChange("dominantDosha", e.target.value)} placeholder="Vata / Pitta / Kapha" />
              </div>
              <div>
                <label className="text-sm font-medium">Constitution Type</label>
                <Input value={patientForm.constitutionType} onChange={(e) => handleChange("constitutionType", e.target.value)} placeholder="e.g., Vata-Pitta" />
              </div>
            </div>

            {/* Goals & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Health Goals (comma separated)</label>
                <Textarea value={patientForm.healthGoals} onChange={(e) => handleChange("healthGoals", e.target.value)} placeholder="Weight management, Stress reduction" />
              </div>
              <div>
                <label className="text-sm font-medium">Work Schedule</label>
                <Input value={patientForm.workSchedule} onChange={(e) => handleChange("workSchedule", e.target.value)} placeholder="9 AM - 6 PM (Mon-Fri)" />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Preferred Session Time</label>
                <Input value={patientForm.preferredSessionTime} onChange={(e) => handleChange("preferredSessionTime", e.target.value)} placeholder="Morning / Afternoon / Evening" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleRegister} disabled={authLoading}>Register Patient</Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Patients</CardTitle>
            <CardDescription>Your registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(patients || []).map((p) => (
                    <TableRow key={String(p._id)}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell className="capitalize">{p.gender}</TableCell>
                      <TableCell>{p.contact}</TableCell>
                      <TableCell>{p.bmi} ({p.bmiCategory})</TableCell>
                      <TableCell>{p.isActive ? "Active" : "Inactive"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(!patients || patients.length === 0) && (
                <div className="text-sm text-muted-foreground mt-4">No patients yet.</div>
              )}
            </div>
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
        return renderDietitianManagement();
      case "patient-management":
        return renderPatientManagement();
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

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-64 md:min-h-screen sidebar-nav border-b md:border-b-0 md:border-r"
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