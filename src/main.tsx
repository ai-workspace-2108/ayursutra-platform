import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import AuthPage from "@/pages/Auth.tsx";
import RoleSelection from "@/pages/RoleSelection.tsx";
import PractitionerAuth from "@/pages/PractitionerAuth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import "./types/global.d.ts";
import TherapistDashboard from "./pages/TherapistDashboard.tsx";
import DietitianDashboard from "./pages/DietitianDashboard.tsx";
import About from "./pages/About.tsx";

function MissingConvexConfig() {
  const current = (import.meta as any).env?.VITE_CONVEX_URL;
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full border rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold">Convex configuration required</h1>
        <p className="text-sm text-muted-foreground">
          Your app attempted to call Convex but VITE_CONVEX_URL is not set. This causes network
          requests to go to "/", resulting in "Failed to fetch".
        </p>
        <div className="text-sm">
          <div className="font-medium">Current VITE_CONVEX_URL:</div>
          <code className="block mt-1 p-2 bg-muted rounded text-xs break-all">
            {String(current ?? "undefined")}
          </code>
        </div>
        <ol className="list-decimal pl-5 text-sm space-y-2">
          <li>Open Integrations → Convex in the top bar and copy your deployment URL.</li>
          <li>Set VITE_CONVEX_URL to that value.</li>
          <li>Reload this page.</li>
        </ol>
        <p className="text-xs text-muted-foreground">
          Example format: https://YOUR-DEPLOYMENT.convex.cloud
        </p>
      </div>
    </div>
  );
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      {typeof (import.meta as any).env?.VITE_CONVEX_URL === "string" &&
      (import.meta as any).env?.VITE_CONVEX_URL?.length > 0 ? (
        <ConvexAuthProvider
          client={
            new ConvexReactClient(
              ((import.meta as any).env.VITE_CONVEX_URL as string) || ""
            )
          }
        >
          <BrowserRouter>
            <RouteSyncer />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/practitioner-auth" element={<PractitionerAuth />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
              <Route path="/dietitian-dashboard" element={<DietitianDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      ) : (
        <>
          <MissingConvexConfig />
          <Toaster />
        </>
      )}
    </InstrumentationProvider>
  </StrictMode>,
);