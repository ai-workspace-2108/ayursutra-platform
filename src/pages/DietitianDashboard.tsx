import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function DietitianDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dietitian Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage diet plans, review patient data, and coordinate care.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Doctor Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Quick access to pending patient assignments and active plans.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pending plan requests</li>
                <li>Active plan monitoring</li>
                <li>Follow-up check-ins</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Your account is registered as a Dietitian and available. Doctors can
                now assign patients to you; counts update automatically across dashboards.
              </p>
              <p>
                Navigate to the Doctor Dashboard to assign a patient to yourself
                or await assignments from doctors.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
