import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Activity, Users, Briefcase, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TherapistDashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const formatted = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [therapistName, setTherapistName] = useState<string>("");
  const [tempName, setTempName] = useState<string>("");
  const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("therapist_name");
      if (saved && saved.trim()) {
        setTherapistName(saved);
        setTempName(saved);
        setIsNameDialogOpen(false);
      } else {
        setIsNameDialogOpen(true);
      }
    } catch {
      setIsNameDialogOpen(true);
    }
  }, []);

  const handleSaveName = () => {
    const name = (tempName || "").trim();
    if (!name) return;
    setTherapistName(name);
    try {
      localStorage.setItem("therapist_name", name);
    } catch {
      // no-op if storage blocked
    }
    setIsNameDialogOpen(false);
  };

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/role-selection")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img src="/assets/ChatGPT_Image_Sep_2__2025__08_48_00_AM.png" alt="AyurSutra" className="h-7 w-7" />
              <span className="font-semibold text-lg">
                Therapist Dashboard
              </span>
              {therapistName ? (
                <span className="text-sm text-muted-foreground">• {therapistName}</span>
              ) : null}
            </div>
          </div>
        </div>
      </motion.nav>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50"
      >
        Sign Out
      </Button>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Today's Therapy Schedule</CardTitle>
              <CardDescription>{formatted}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">Total Sessions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Scheduled for today</p>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm">Completed</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Marked as done</p>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <CardTitle className="text-sm">Next Session</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">Countdown starts when scheduled</p>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm">Workload</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Light</div>
                  <p className="text-xs text-muted-foreground">Auto-calculated from sessions</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
            </TabsList>

            {/* Overview quick actions */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Upcoming Today</CardTitle>
                    <CardDescription>Next few scheduled sessions will appear here</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No upcoming sessions yet. Sessions assigned to you will show in real-time.
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage live sessions fast</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Check-in Patient
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Start Session Timer
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Session
                    </Button>
                    <Button variant="destructive" className="justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Reschedule
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sessions module */}
            <TabsContent value="sessions" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Therapy Sessions</CardTitle>
                  <CardDescription>Browse your upcoming, past, and cancelled sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="coming" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 max-w-md">
                      <TabsTrigger value="coming">Coming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                      <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>

                    <TabsContent value="coming" className="mt-6 space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Your upcoming sessions will be listed here with preparation checklists.
                      </div>
                    </TabsContent>

                    <TabsContent value="past" className="mt-6 space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Completed session history with notes and ratings will appear here.
                      </div>
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-6 space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Cancelled sessions along with reasons and rescheduling options will be listed here.
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave request system */}
            <TabsContent value="leaves" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>Leave Request Application</CardTitle>
                      <CardDescription>Submit and track your leave requests</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Leave Type</label>
                      <select className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                        <option> Sick Leave</option>
                        <option> Personal</option>
                        <option> Vacation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (days)</label>
                      <Input type="number" min={1} placeholder="e.g. 3" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for Leave</label>
                    <Textarea placeholder="Provide the reason (500 chars max)" maxLength={500} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Impact Assessment</div>
                    <div className="text-sm text-muted-foreground">
                      System will analyze scheduled sessions, rescheduling options, and coverage upon submission.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="sm:w-auto w-full">Submit Request</Button>
                    <Button variant="outline" className="sm:w-auto w-full">
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! What's your name?</DialogTitle>
            <DialogDescription>
              We'll use this to personalize your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Enter your full name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNameDialogOpen(false)}>
                Skip
              </Button>
              <Button onClick={handleSaveName}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}