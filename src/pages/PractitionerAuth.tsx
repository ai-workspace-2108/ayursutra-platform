import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PractitionerAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    // Read selection from RoleSelection
    const selectedRole = sessionStorage.getItem("selectedRole");
    // For Therapist, proceed to the Therapist Dashboard to maintain the flow
    if (selectedRole === "therapist") {
      navigate("/therapist-dashboard", { replace: true });
      return;
    }
    // Fallback: send them back to role selection
    navigate("/role-selection", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Redirecting...
    </div>
  );
}