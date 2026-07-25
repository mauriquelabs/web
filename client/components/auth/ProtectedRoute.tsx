import { Navigate, useLocation } from "react-router-dom";
import { isAdminUser } from "@shared/auth";
import { useAuth } from "@/contexts/AuthProvider";
import { getClientAdminEmails } from "@/lib/admin";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdminUser(session.user, getClientAdminEmails())) {
    return (
      <Navigate
        to="/admin/login"
        state={{ error: "You do not have admin access." }}
        replace
      />
    );
  }

  return children;
}
