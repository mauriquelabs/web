import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import CompaniesView from "./CompaniesView";

export default function AdminPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="section-container flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent2">
              Maurique Labs
            </p>
            <h1 className="text-2xl">CMS Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-foreground/70 sm:inline">
              {user?.email}
            </span>
            <button type="button" onClick={signOut} className="btn-outline">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="section-container py-12">
        <CompaniesView />

        <p className="mt-8">
          <Link to="/" className="text-accent2 hover:underline">
            Back to site
          </Link>
        </p>
      </main>
    </div>
  );
}
