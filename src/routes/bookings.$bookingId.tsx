import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { SignInPrompt, StatusBadge } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, formatKES } from "@/lib/pricing";

export const Route = createFileRoute("/bookings/$bookingId")({
  head: () => ({
    meta: [
      { title: "Booking confirmation — La Squadra d'Oro" },
      { name: "description", content: "Your booking reference, dates, pickup point and price breakdown." },
      { property: "og:title", content: "Booking confirmation — La Squadra d'Oro" },
      { property: "og:description", content: "Booking reference and price breakdown." },
    ],
  }),
  component: BookingDetail,
});

function BookingDetail() {
  const { bookingId } = Route.useParams();
  const { user, ready } = useAuth();
  const q = useQuery({ queryKey: ["booking", bookingId, user?.id], queryFn: () => api.getBooking(Number(bookingId)), enabled: !!user, retry: false });
  if (!ready) return null;
  if (!user) return <SignInPrompt role="customer" />;
  if (q.isLoading) return <div className="mx-auto max-w-2xl px-4 py-12"><Skeleton className="h-96 rounded-2xl" /></div>;
  if (q.error || !q.data) return <p className="py-24 text-center text-muted-foreground">{(q.error as Error)?.message ?? "Booking not found"}</p>;
  const b = q.data;
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-muted-foreground">Booking reference</p>
        <h1 className="mt-1 font-mono text-4xl font-bold tracking-wider">{b.reference}</h1>
        <div className="mt-3 flex justify-center"><StatusBadge status={b.status} /></div>
        {b.status === "pending" && <p className="mt-3 text-sm text-muted-foreground">Our team will confirm shortly. Keep this reference for pickup.</p>}
      </div>
      <div className="mt-8 rounded-2xl border bg-card p-6">
        <div className="flex gap-4">
          <img src={b.car?.primary_image_url} alt="" width={160} height={107} className="h-20 w-28 rounded-lg object-cover" />
          <div>
            <p className="font-display text-2xl">{b.car?.make} {b.car?.model}</p>
            <p className="text-sm text-muted-foreground">{b.car?.registration_number}</p>
          </div>
        </div>
        <Separator className="my-5" />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Pickup</dt><dd className="font-medium">{formatDate(b.start_date)}</dd></div>
          <div><dt className="text-muted-foreground">Return</dt><dd className="font-medium">{formatDate(b.end_date)}</dd></div>
          <div className="col-span-2"><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{b.pickup_location}</dd></div>
          {b.extras.length > 0 && <div className="col-span-2"><dt className="text-muted-foreground">Add-ons</dt><dd className="font-medium">{b.extras.map((e) => e.name).join(", ")}</dd></div>}
        </dl>
        <Separator className="my-5" />
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{formatKES(b.daily_rate_snapshot)} × {b.days} days</dt><dd>{formatKES(b.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Add-ons</dt><dd>{formatKES(b.extras_total)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">VAT (16%)</dt><dd>{formatKES(b.tax)}</dd></div>
          <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatKES(b.total_amount)}</dd></div>
          <div className="flex justify-between rounded-md bg-gold/15 px-2 py-1.5"><dt>Deposit (20%)</dt><dd className="font-semibold">{formatKES(b.deposit)}</dd></div>
        </dl>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild variant="outline"><Link to="/cars">Book another</Link></Button>
        {user.role === "customer" ? <Button asChild><Link to="/bookings">My bookings</Link></Button> : <Button asChild><Link to="/admin/bookings">All bookings</Link></Button>}
      </div>
    </div>
  );
}
