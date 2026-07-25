import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { AuthMeResponse } from "@shared/auth";

type VerificationStatus = "checking" | "verified" | "failed";

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("checking");

  useEffect(() => {
    async function verifySession() {
      if (!isSupabaseConfigured()) {
        setVerificationStatus("failed");
        return;
      }

      try {
        const {
          data: { session },
        } = await getSupabase().auth.getSession();

        if (!session?.access_token) {
          setVerificationStatus("failed");
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          await signOut();
          setVerificationStatus("failed");
          return;
        }

        const data = (await response.json()) as AuthMeResponse;

        if (data.user.id !== user?.id) {
          await signOut();
          setVerificationStatus("failed");
          return;
        }

        setVerificationStatus("verified");
      } catch {
        await signOut();
        setVerificationStatus("failed");
      }
    }

    void verifySession();
  }, [user?.id, signOut]);

  if (verificationStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Verifying admin access…</p>
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <Navigate
        to="/admin/login"
        state={{ error: "Server could not verify admin access." }}
        replace
      />
    );
  }

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
        <div className="card-base max-w-2xl">
          <h2 className="text-xl mb-2">Authentication is working</h2>
          <p className="text-foreground/70 mb-6">
            You are signed in. This area will become the content management
            interface in a follow-up step.
          </p>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-medium text-foreground/60">Signed in as</dt>
              <dd>{user?.email ?? "Unknown"}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-8">
          <Link to="/" className="text-accent2 hover:underline">
            Back to site
          </Link>
        </p>
      </main>
    </div>
  );
}
