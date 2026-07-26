import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { verifyAdminAccess } from "@/lib/verifyAdmin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { session, loading, signIn, signOut } = useAuth();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/admin";
  const redirectError =
    (location.state as { error?: string } | null)?.error ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(redirectError);
  const [submitting, setSubmitting] = useState(false);
  const [adminVerified, setAdminVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!session?.access_token) {
      setAdminVerified(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    verifyAdminAccess(session.access_token, controller.signal)
      .then(async (result) => {
        if (cancelled) {
          return;
        }

        if (!result.ok) {
          await signOut();
          setError("You do not have admin access.");
          setAdminVerified(false);
          return;
        }

        setAdminVerified(true);
      })
      .catch((verifyError: unknown) => {
        if (
          cancelled ||
          (verifyError instanceof DOMException && verifyError.name === "AbortError")
        ) {
          return;
        }

        setAdminVerified(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [loading, session?.access_token, signOut]);

  if (loading || (session && adminVerified === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/70">Loading…</p>
      </div>
    );
  }

  if (session && adminVerified) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent2 mb-2">
            Maurique Labs
          </p>
          <h1 className="text-3xl sm:text-4xl">Admin sign in</h1>
          <p className="mt-2 text-foreground/70">
            Sign in to manage site content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-base space-y-6">
          {!isSupabaseConfigured() && (
            <div
              className="rounded-card border border-accent2/40 bg-accent2/10 px-4 py-3 text-sm text-foreground"
              role="status"
            >
              Supabase is not configured yet. Copy `.env.example` into `.env` and
              add your project URL and anon key.
            </div>
          )}

          {error && (
            <div
              className="flex items-start gap-2 rounded-card border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@mauriquelabs.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-50 disabled:hover:scale-100"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/60">
          <Link to="/" className="text-accent2 hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
