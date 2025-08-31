import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PractitionerAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/role-selection", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">Redirecting to role selection…</p>
        <button
          onClick={() => navigate("/role-selection", { replace: true })}
          className="underline text-primary"
        >
          Go now
        </button>
      </div>
    </div>
  );
}