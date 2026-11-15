import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { resetMockDb } from "@/lib/api/mock";
import { addDays, formatKES, todayIso } from "@/lib/pricing";
import type { BookingStatus, Car } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gold font-display text-sm font-bold text-gold-foreground">SO</span>
      <span className="font-display text-lg leading-none">La Squadra <em className="text-gold">d'Oro</em></span>
    </Link>
  );
}

export function SiteHeader() {
  const { user, switchRole, signOut } = useAuth();
  const navigate = useNavigate();
  const link = "text-sm text-muted-foreground transition-colors hover:text-foreground";
  const active = { className: "text-foreground font-semibold" };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/cars" className={link} activeProps={active}>Fleet</Link>
          {user?.role === "customer" && <Link to="/bookings" className={link} activeProps={active}>My bookings</Link>}
          {user?.role === "admin" && <Link to="/admin" className={link} activeProps={active}>Admin panel</Link>}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <span className="hidden sm:inline">{user ? user.full_name.split(" ")[0] : "Visitor"}</span>
              <Badge variant="secondary" className="capitalize">{user?.role ?? "guest"}</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>Demo: switch perspective</DropdownMenuLabel>
            <DropdownMenuItem onClick={async () => { await switchRole("customer"); toast.success("Signed in as customer (Wanjiru)"); navigate({ to: "/bookings" }); }}>
              Customer — Wanjiru Kamau
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => { await switchRole("admin"); toast.success("Signed in as admin (Grace)"); navigate({ to: "/admin" }); }}>
              Admin — Grace Mwangi
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user && <DropdownMenuItem onClick={() => { signOut(); navigate({ to: "/", replace: true }); }}>Sign out</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => { resetMockDb(); location.reload(); }}>Reset demo data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">La Squadra <em className="text-gold">d'Oro</em></p>
          <p className="mt-2 text-sm opacity-70">Premium car rental across Nairobi. Airport delivery, transparent KES pricing, 16% VAT included in every quote.</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="mb-2 font-semibold opacity-100">Pickup points</p>
          <p>JKIA · Wilson Airport · Westlands · Kilimani · Karen · CBD</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="mb-2 font-semibold opacity-100">Contact</p>
          <p>+254 700 000 001 · hello@lasquadradoro.co.ke</p>
        </div>
      </div>
    </footer>
  );
}

export function CarCard({ car, search }: { car: Car; search?: { start?: string | undefined; end?: string | undefined } | undefined }) {
  return (
    <Link to="/cars/$carId" params={{ carId: String(car.id) }} search={search ?? {}} className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-xl">
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img src={car.primary_image_url} alt={`${car.make} ${car.model}`} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground hover:bg-background">{car.category?.name}</Badge>
        {car.status === "maintenance" && <Badge variant="destructive" className="absolute right-3 top-3">In maintenance</Badge>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
            <p className="text-xs text-muted-foreground">{car.year} · {car.colour}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatKES(car.daily_rate)}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span>{car.seats} {car.seats === 1 ? "person" : "people"}</span>
          <span className="capitalize">{car.transmission}</span>
          <span className="capitalize">{car.fuel_type}</span>
        </div>
      </div>
    </Link>
  );
}

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  confirmed: "bg-gold/15 text-foreground border-gold/40",
  active: "bg-success/15 text-success border-success/30",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};
export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant="outline" className={cn("capitalize", STATUS_STYLE[status])}>{status}</Badge>;
}

export function SearchWidget({ className, initial }: { className?: string; initial?: { start?: string | undefined; end?: string | undefined; category?: number | undefined } }) {
  const navigate = useNavigate();
  const t = todayIso();
  const [start, setStart] = useState(initial?.start ?? addDays(t, 1));
  const [end, setEnd] = useState(initial?.end ?? addDays(t, 4));
  const [category, setCategory] = useState(initial?.category ? String(initial.category) : "all");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (end <= start) { toast.error("Return date must be after pickup date"); return; }
    navigate({ to: "/cars", search: { start, end, category: category === "all" ? undefined : Number(category) } });
  };
  return (
    <form onSubmit={submit} className={cn("grid gap-3 rounded-2xl border bg-card p-4 shadow-2xl sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end", className)}>
      <div className="space-y-1.5"><Label htmlFor="s">Pickup date</Label><Input id="s" type="date" min={t} value={start} onChange={(e) => setStart(e.target.value)} /></div>
      <div className="space-y-1.5"><Label htmlFor="e">Return date</Label><Input id="e" type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} /></div>
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="1">Economy</SelectItem>
            <SelectItem value="2">SUV</SelectItem>
            <SelectItem value="3">Luxury</SelectItem>
            <SelectItem value="4">Van</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">Check availability</Button>
    </form>
  );
}

export function SignInPrompt({ role }: { role: "customer" | "admin" }) {
  const { switchRole } = useAuth();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl">{role === "admin" ? "Staff only" : "Sign in to see your bookings"}</h1>
      <p className="mt-2 text-muted-foreground">This demo uses a role switcher instead of passwords.</p>
      <Button className="mt-6" onClick={() => switchRole(role)}>Continue as demo {role}</Button>
    </div>
  );
}

