import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PractitionerAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/role-selection", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
      Redirecting to role selection...
    </div>
  );
}