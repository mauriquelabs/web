import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { verifyAdminAccess } from "@/lib/verifyAdmin";

type AdminCheckStatus = "idle" | "checking" | "allowed" | "denied";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [adminStatus, setAdminStatus] = useState<AdminCheckStatus>("idle");

  useEffect(() => {
    if (loading || !session?.access_token) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    setAdminStatus("checking");

    verifyAdminAccess(session.access_token, controller.signal)
      .then((result) => {
        if (cancelled) {
          return;
        }

        setAdminStatus(result.ok ? "allowed" : "denied");
      })
      .catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }

        setAdminStatus("denied");
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [loading, session?.access_token]);

  if (loading || (session && adminStatus === "checking")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (adminStatus === "denied") {
    return (
      <Navigate
        to="/admin/login"
        state={{ error: "You do not have admin access." }}
        replace
      />
    );
  }

  if (adminStatus !== "allowed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Loading…</p>
      </div>
    );
  }

  return children;
}
