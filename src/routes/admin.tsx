import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SignInPrompt } from "@/components/site";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — La Squadra d'Oro" },
      { name: "description", content: "Fleet, bookings and KPIs for La Squadra d'Oro staff." },
      { property: "og:title", content: "Admin Panel — La Squadra d'Oro" },
      { property: "og:description", content: "Staff operations dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, ready } = useAuth();
  if (!ready) return null;
  // UI gate only — the backend must enforce the admin role on every /admin endpoint.
  if (user?.role !== "admin") return <SignInPrompt role="admin" />;
  const tab = "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground";
  const on = { className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Staff</p>
          <h1 className="text-4xl">Operations</h1>
        </div>
        <nav className="flex gap-1 rounded-lg border bg-card p-1">
          <Link to="/admin" activeOptions={{ exact: true }} className={tab} activeProps={on}>Dashboard</Link>
          <Link to="/admin/fleet" className={tab} activeProps={on}>Fleet</Link>
          <Link to="/admin/bookings" className={tab} activeProps={on}>Bookings</Link>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
