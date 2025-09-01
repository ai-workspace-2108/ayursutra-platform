import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

type AssignmentWithPatient = {
  _id: string;
  patientId: string;
  dietitianId: string;
  doctorId: string;
  assignedDate: string;
  status: "active" | "completed" | "cancelled";
  dietPlan?: string;
  notes?: string;
  followUpDate?: string;
  patient?: any;
};

export default function DietitianDashboard() {
  // Load current dietitian (by auth user)
  const me = useQuery(api.dietitians.getMyDietitian) as
    | { _id: string; name: string; currentPatientCount: number; maxPatientsPerDay: number }
    | null
    | undefined;

  const [nameInput, setNameInput] = useState<string>("");
  const [nameDialogOpen, setNameDialogOpen] = useState<boolean>(false);

  // Ensure name prompt on first load if missing/placeholder
  useEffect(() => {
    if (me === undefined) return; // loading
    if (me && (!me.name || me.name.trim() === "" || me.name === "Dietitian")) {
      setNameInput("");
      setNameDialogOpen(true);
    }
  }, [me]);

  const updateName = useMutation(api.dietitians.updateDietitianName);

  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithPatient | null>(null);
  const [previewPlan, setPreviewPlan] = useState<string>("");

  const setDietPlan = useMutation(api.dietitians.setDietPlan);
  const generatePlan = useAction(api.dietPlans.generateDietPlan);

  // Load all assignments for this dietitian (status active) and split into pending/active by dietPlan presence
  const assignments = useQuery(
    api.dietitians.getDietitianAssignments,
    me ? ({ dietitianId: me._id as any, status: "active" } as any) : "skip"
  ) as AssignmentWithPatient[] | undefined;

  const { pending, active } = useMemo(() => {
    const list = assignments ?? [];
    return {
      pending: list.filter((a) => !a.dietPlan && a.status === "active"),
      active: list.filter((a) => !!a.dietPlan && a.status === "active"),
    };
  }, [assignments]);

  const overview = useMemo(() => {
    const totalAssigned = (assignments ?? []).length;
    const pendingCount = (pending ?? []).length;
    const activeCount = (active ?? []).length;
    return {
      totalAssigned,
      pendingCount,
      activeCount,
      capacityText:
        me ? `${me.currentPatientCount}/${me.maxPatientsPerDay} capacity used` : "",
    };
  }, [assignments, pending, active, me]);

  async function handleSaveName() {
    if (!me) return;
    const val = nameInput.trim();
    if (!val) {
      toast("Please enter your name.");
      return;
    }
    try {
      await updateName({ dietitianId: me._id as any, name: val });
      toast("Name saved");
      setNameDialogOpen(false);
    } catch (e: any) {
      toast(`Failed to save name: ${e.message}`);
    }
  }

  function buildPatientSummary(p: any) {
    const mh = (p.medicalHistory ?? []).join(", ");
    const meds = (p.currentMedications ?? []).join(", ");
    const allergies = (p.allergies ?? []).join(", ");
    const goals = (p.healthGoals ?? []).join(", ");
    return `
Patient: ${p.name} (${p.gender}, ${p.age}y)
Height: ${p.height}cm, Weight: ${p.weight}kg, BMI: ${p.bmi} (${p.bmiCategory})
Constitution: ${p.prakriti}${p.vikriti ? `; Vikriti: ${p.vikriti}` : ""}

Medical History: ${mh || "None"}
Current Medications: ${meds || "None"}
Allergies: ${allergies || "None"}
Health Goals: ${goals || "None"}
Work Schedule: ${p.workSchedule}; Preferred Session Time: ${p.preferredSessionTime}
`;
  }

  async function handleGeneratePlan(a: AssignmentWithPatient) {
    if (!a.patient) {
      toast("Missing patient data for this assignment.");
      return;
    }
    setSelectedAssignment(a);
    try {
      const summary = buildPatientSummary(a.patient);
      const plan = await generatePlan({
        patientSummary: summary,
        constitution: a.patient.prakriti,
        medicalConditions: (a.patient.medicalHistory ?? []).join(", "),
        restrictions: (a.patient.allergies ?? []).join(", "),
        preferredMealTimes: a.patient.preferredSessionTime ?? "",
      });
      setPreviewPlan(plan || "");
      toast("AI plan generated. Review and adjust as needed.");
    } catch (e: any) {
      toast(`Failed to generate plan: ${e.message}`);
    }
  }

  async function handleSavePlan() {
    if (!selectedAssignment) return;
    const content = previewPlan.trim();
    if (!content) {
      toast("Plan is empty. Please add content before saving.");
      return;
    }
    try {
      await setDietPlan({
        assignmentId: selectedAssignment._id as any,
        plan: content,
      });
      toast("Diet plan saved and patient moved to Active.");
      setSelectedAssignment(null);
      setPreviewPlan("");
    } catch (e: any) {
      toast(`Failed to save plan: ${e.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Dietitian Dashboard{me?.name ? ` - ${me.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage diet plans, review OPD data, and coordinate care.
          </p>
        </div>

        {/* Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader><CardTitle>Patient Load</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Total Assigned: <strong>{overview.totalAssigned}</strong></div>
              <div>Pending Review: <strong>{overview.pendingCount}</strong></div>
              <div>Active Plans: <strong>{overview.activeCount}</strong></div>
              <div className="text-muted-foreground">{overview.capacityText}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Today</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Focus on pending assignments, review OPD data and generate plans.</div>
              <div>Ensure plans align with patient work times and medical needs.</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Clinical Safety</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>All AI plans require professional review before activation.</div>
              <div>Screen for allergies, medications, and contraindications.</div>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-6" />

        {/* Pending Diet Management */}
        <div className="space-y-4 mb-10">
          <div>
            <h2 className="text-xl font-semibold">Pending Diet Plan Generation</h2>
            <p className="text-sm text-muted-foreground">
              Review OPD data and generate plans. Pending are assignments without a saved plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(pending ?? []).map((a) => (
              <Card key={a._id}>
                <CardHeader>
                  <CardTitle>
                    {a.patient?.name ?? "Patient"} • Assigned {a.assignedDate}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="text-muted-foreground">
                    Constitution: {a.patient?.prakriti ?? "—"} • BMI: {a.patient?.bmi} ({a.patient?.bmiCategory})
                  </div>
                  <div>
                    Goals: {(a.patient?.healthGoals ?? []).join(", ") || "—"}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" onClick={() => setSelectedAssignment(a)}>
                      View OPD Data
                    </Button>
                    <Button onClick={() => handleGeneratePlan(a)}>
                      Generate AI Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pending && pending.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No pending assignments.
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Active Diet Plans */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Active Diet Plans</h2>
            <p className="text-sm text-muted-foreground">
              Patients with an approved diet plan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(active ?? []).map((a) => (
              <Card key={a._id}>
                <CardHeader>
                  <CardTitle>{a.patient?.name ?? "Patient"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>Plan Summary:</div>
                  <div className="text-muted-foreground whitespace-pre-wrap max-h-64 overflow-auto border rounded p-3">
                    {a.dietPlan}
                  </div>
                </CardContent>
              </Card>
            ))}
            {active && active.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No active plans yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name Dialog */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please enter your full name to display in the doctor dashboard.
            </p>
            <Input
              placeholder="e.g., Sarah Johnson, RD"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OPD + Plan Review Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={(o) => {
        if (!o) { setSelectedAssignment(null); setPreviewPlan(""); }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>OPD Review & Plan</DialogTitle>
          </DialogHeader>

          {selectedAssignment && (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader><CardTitle>Patient OPD Data</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div><strong>Name:</strong> {selectedAssignment.patient?.name}</div>
                  <div>
                    <strong>Demographics:</strong> {selectedAssignment.patient?.age}y • {selectedAssignment.patient?.gender}
                  </div>
                  <div>
                    <strong>Anthropometrics:</strong> {selectedAssignment.patient?.height}cm • {selectedAssignment.patient?.weight}kg • BMI {selectedAssignment.patient?.bmi} ({selectedAssignment.patient?.bmiCategory})
                  </div>
                  <div><strong>Constitution:</strong> {selectedAssignment.patient?.prakriti}</div>
                  <div><strong>Medical History:</strong> {(selectedAssignment.patient?.medicalHistory ?? []).join(", ") || "—"}</div>
                  <div><strong>Medications:</strong> {(selectedAssignment.patient?.currentMedications ?? []).join(", ") || "—"}</div>
                  <div><strong>Allergies:</strong> {(selectedAssignment.patient?.allergies ?? []).join(", ") || "—"}</div>
                  <div><strong>Health Goals:</strong> {(selectedAssignment.patient?.healthGoals ?? []).join(", ") || "—"}</div>
                  <div><strong>Work Schedule:</strong> {selectedAssignment.patient?.workSchedule}</div>
                  <div><strong>Preferred Meal/Session Time:</strong> {selectedAssignment.patient?.preferredSessionTime}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Diet Plan (Review & Edit)</CardTitle></CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-64 p-3 text-sm border rounded whitespace-pre-wrap"
                    placeholder="Generated plan will appear here. You can edit before saving."
                    value={previewPlan}
                    onChange={(e) => setPreviewPlan(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button onClick={handleSavePlan}>Save & Activate</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}