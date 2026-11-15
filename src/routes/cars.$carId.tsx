import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { AlertTriangle, ArrowLeft, CalendarX, Fuel, Gauge, Loader2, Settings2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { addDays, formatDate, formatKES, overlaps, todayIso } from "@/lib/pricing";
import { PICKUP_LOCATIONS } from "@/lib/types";

export const Route = createFileRoute("/cars/$carId")({
  validateSearch: z.object({ start: z.string().optional(), end: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Car details & live quote — La Squadra d'Oro" },
      { name: "description", content: "See specs, booked dates and a live KES quote with VAT, deposit and add-ons." },
      { property: "og:title", content: "Car details & live quote — La Squadra d'Oro" },
      { property: "og:description", content: "Live KES quote with 16% VAT and 20% deposit." },
    ],
  }),
  component: CarDetailPage,
});

function CarDetailPage() {
  const { carId } = Route.useParams();
  const s = Route.useSearch();
  const id = Number(carId);
  const t = todayIso();
  const { user, setUser, switchRole } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const car = useQuery({ queryKey: ["car", id], queryFn: () => api.getCar(id) });
  const extras = useQuery({ queryKey: ["extras"], queryFn: () => api.listExtras() });

  const [start, setStart] = useState(s.start ?? addDays(t, 1));
  const [end, setEnd] = useState(s.end ?? addDays(t, 4));
  const [extraIds, setExtraIds] = useState<number[]>([]);
  const [location, setLocation] = useState<string>(PICKUP_LOCATIONS[0]);
  const [licence, setLicence] = useState("");
  const [expiry, setExpiry] = useState("");
  useEffect(() => { if (user) { setLicence(user.licence_number ?? ""); setExpiry(user.licence_expiry ?? ""); } }, [user]);

  const clash = useMemo(() => car.data?.booked_ranges.find((r) => overlaps({ start_date: start, end_date: end }, r)), [car.data, start, end]);
  const dateError = end <= start ? "Return must be after pickup" : start < t ? "Pickup can't be in the past" : clash ? `Already booked ${formatDate(clash.start_date)} – ${formatDate(clash.end_date)}` : null;

  const quote = useQuery({
    queryKey: ["quote", id, start, end, extraIds],
    queryFn: () => api.quote({ car_id: id, start_date: start, end_date: end, extra_ids: extraIds }),
    enabled: !(end <= start || start < t),
    retry: false,
  });

  const book = useMutation({
    mutationFn: async () => {
      if (!licence || !expiry) throw new Error("Enter your driver's licence number and expiry date");
      if (licence !== user?.licence_number || expiry !== user?.licence_expiry) setUser(await api.updateMe({ licence_number: licence, licence_expiry: expiry }));
      return api.createBooking({ car_id: id, start_date: start, end_date: end, extra_ids: extraIds, pickup_location: location });
    },
    onSuccess: (b) => {
      qc.invalidateQueries();
      toast.success(`Booking ${b.reference} received`);
      navigate({ to: "/bookings/$bookingId", params: { bookingId: String(b.id) } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (car.isLoading) return <div className="mx-auto max-w-7xl px-4 py-10"><Skeleton className="h-[480px] rounded-2xl" /></div>;
  if (car.error || !car.data) return <div className="mx-auto max-w-7xl px-4 py-24 text-center"><p>Car not found.</p><Link to="/cars" className="underline">Back to fleet</Link></div>;
  const c = car.data;
  const unavailable = c.status !== "available";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/cars" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to fleet</Link>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <img src={c.primary_image_url} alt={`${c.make} ${c.model}`} width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{c.category?.name}</Badge>
            {unavailable && <Badge variant="destructive" className="capitalize">{c.status}</Badge>}
            <span className="text-sm text-muted-foreground">Reg. {c.registration_number}</span>
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl">{c.make} {c.model} <span className="text-muted-foreground">{c.year}</span></h1>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { i: Users, l: "Seats", v: c.seats },
              { i: Settings2, l: "Gearbox", v: c.transmission },
              { i: Fuel, l: "Fuel", v: c.fuel_type },
              { i: Gauge, l: "Odometer", v: `${c.mileage.toLocaleString()} km` },
            ].map(({ i: I, l, v }) => (
              <div key={l} className="rounded-xl border bg-card p-4"><I className="h-4 w-4 text-gold" /><p className="mt-2 text-xs text-muted-foreground">{l}</p><p className="font-semibold capitalize">{v}</p></div>
            ))}
          </div>
          <div className="mt-8">
            <h2 className="text-xl">Already booked</h2>
            {c.booked_ranges.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No bookings yet — wide open.</p> : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {c.booked_ranges.map((r) => <li key={r.start_date} className="flex items-center gap-1.5 rounded-full border bg-muted px-3 py-1 text-sm"><CalendarX className="h-3.5 w-3.5 text-destructive" />{formatDate(r.start_date)} → {formatDate(r.end_date)}</li>)}
              </ul>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Return dates are checkout-style: a new rental may start on the day another ends.</p>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
          <p className="font-display text-3xl">{formatKES(c.daily_rate)} <span className="font-sans text-sm text-muted-foreground">/ day</span></p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label htmlFor="ds">Pickup</Label><Input id="ds" type="date" min={t} value={start} onChange={(e) => setStart(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="de">Return</Label><Input id="de" type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} /></div>
          </div>
          {dateError && <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertTriangle className="h-4 w-4" />{dateError}</p>}
          <div className="mt-4 space-y-1.5">
            <Label>Pickup location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PICKUP_LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="mt-5 space-y-2">
            <Label>Add-ons</Label>
            {extras.data?.map((e) => (
              <label key={e.id} className="flex cursor-pointer items-center justify-between rounded-lg border p-3 text-sm hover:bg-muted/50">
                <span className="flex items-center gap-3">
                  <Checkbox checked={extraIds.includes(e.id)} onCheckedChange={(v) => setExtraIds((p) => (v ? [...p, e.id] : p.filter((x) => x !== e.id)))} />
                  <span><span className="font-medium">{e.name}</span><span className="block text-xs text-muted-foreground">{e.description}</span></span>
                </span>
                <span className="text-right text-xs">{formatKES(e.price)}<span className="block text-muted-foreground">{e.per_day ? "per day" : "one-off"}</span></span>
              </label>
            ))}
          </div>

          <Separator className="my-5" />
          {quote.data && !dateError ? (
            <dl className="space-y-1.5 text-sm">
              <Row l={`${formatKES(quote.data.daily_rate)} × ${quote.data.days} day${quote.data.days > 1 ? "s" : ""}`} v={quote.data.subtotal} />
              <Row l="Add-ons" v={quote.data.extras_total} />
              <Row l="VAT (16%)" v={quote.data.tax} />
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatKES(quote.data.total_amount)}</dd></div>
              <div className="flex justify-between rounded-md bg-gold/15 px-2 py-1.5"><dt>Deposit due now (20%)</dt><dd className="font-semibold">{formatKES(quote.data.deposit)}</dd></div>
            </dl>
          ) : <p className="text-sm text-muted-foreground">{quote.isFetching ? "Calculating…" : "Choose valid dates to see your quote."}</p>}

          <Separator className="my-5" />
          {!user ? (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p>Sign in as a customer to book.</p>
              <Button className="mt-3 w-full" onClick={() => switchRole("customer").then(() => toast.success("Signed in as Wanjiru (demo customer)"))}>Continue as demo customer</Button>
            </div>
          ) : user.role === "admin" ? (
            <p className="rounded-lg bg-muted p-4 text-sm">You're viewing as admin. Switch to the customer view in the top-right menu to book.</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-semibold">Driver's licence</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="lic">Licence no.</Label><Input id="lic" value={licence} onChange={(e) => setLicence(e.target.value)} placeholder="DL-0000000" /></div>
                <div className="space-y-1.5"><Label htmlFor="exp">Expiry</Label><Input id="exp" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} /></div>
              </div>
              <Button size="lg" className="mt-4 w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={!!dateError || unavailable || book.isPending || !quote.data} onClick={() => book.mutate()}>
                {book.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {unavailable ? "Currently unavailable" : "Request booking"}
              </Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({ l, v }: { l: string; v: number }) {
  return <div className="flex justify-between"><dt className="text-muted-foreground">{l}</dt><dd>{formatKES(v)}</dd></div>;
}
