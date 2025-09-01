import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PractitionerAuth() {
  const navigate = useNavigate();
  const registerTherapist = useMutation(api.therapists.registerSelfIfMissing);
  const registerDietitian = useMutation(api.dietitians.registerSelfIfMissing);

  useEffect(() => {
    // Read selection from RoleSelection
    const selectedRole = sessionStorage.getItem("selectedRole");
    // For Therapist, proceed to the Therapist Dashboard to maintain the flow
    if (selectedRole === "therapist") {
      (async () => {
        try {
          // Ensure therapist record exists and is available before redirect
          await registerTherapist({});
        } catch {
          // Non-blocking: if registration fails, continue navigation
        } finally {
          navigate("/therapist-dashboard", { replace: true });
        }
      })();
      return;
    }

    // Add: handle dietician role -> register and redirect
    if (selectedRole === "dietician") {
      (async () => {
        try {
          await registerDietitian({});
        } catch {
        } finally {
          navigate("/dietitian-dashboard", { replace: true });
        }
      })();
      return;
    }
    // Fallback: send them back to role selection
    navigate("/role-selection", { replace: true });
  }, [navigate, registerTherapist]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Redirecting...
    </div>
  );
}