import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/site";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatDate, formatKES } from "@/lib/pricing";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => api.dashboard() });
  if (isLoading || !data) return <div className="grid gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>;
  const month = new Date().toLocaleDateString("en-GB", { month: "long" });
  const kpis = [
    { label: "Cars on hire", value: data.cars_on_hire, sub: `of ${data.fleet_total} in fleet` },
    { label: `${month} revenue`, value: formatKES(data.monthly_revenue), sub: "incl. VAT, excl. cancelled" },
    { label: "Pending approval", value: data.pending_bookings, sub: "awaiting confirmation" },
    { label: "In maintenance", value: data.fleet_maintenance, sub: `${data.fleet_available} available` },
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 font-display text-3xl">{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl">Upcoming returns · next 7 days</h2>
          <Link to="/admin/bookings" search={{ status: "active" }} className="text-sm underline-offset-4 hover:underline">Manage →</Link>
        </div>
        {data.upcoming_returns.length === 0 ? <p className="p-5 text-sm text-muted-foreground">Nothing due back this week.</p> : (
          <ul className="divide-y">
            {data.upcoming_returns.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-medium">{b.car?.make} {b.car?.model} <span className="text-sm text-muted-foreground">· {b.car?.registration_number}</span></p>
                  <p className="text-sm text-muted-foreground">{b.user?.full_name} · {b.reference}</p>
                </div>
                <div className="flex items-center gap-3"><StatusBadge status={b.status} /><span className="text-sm font-semibold">Due {formatDate(b.end_date)}</span></div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
