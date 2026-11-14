import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { StatusBadge } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatDate, formatKES } from "@/lib/pricing";
import type { Booking, BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "active", "completed", "cancelled"] as const;
export const Route = createFileRoute("/admin/bookings")({
  validateSearch: z.object({ status: z.enum(STATUSES).optional() }),
  component: AdminBookings,
});

function AdminBookings() {
  const { status } = Route.useSearch();
  const navigate = Route.useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "bookings", status], queryFn: () => api.adminBookings(status) });
  const [mileage, setMileage] = useState<{ b: Booking; kind: "pickup" | "return"; value: string } | null>(null);

  const act = useMutation({
    mutationFn: (a: { kind: "confirm" | "pickup" | "return" | "cancel"; b: Booking; km?: number }) =>
      a.kind === "confirm" ? api.confirmBooking(a.b.id) : a.kind === "cancel" ? api.cancelBooking(a.b.id) : a.kind === "pickup" ? api.pickupBooking(a.b.id, a.km!) : api.returnBooking(a.b.id, a.km!),
    onSuccess: (b) => { toast.success(`${b.reference} → ${b.status}`); setMileage(null); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filter = (s?: BookingStatus) => navigate({ to: ".", search: { status: s }, replace: true });
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex flex-wrap gap-2 border-b p-4">
        {[undefined, ...STATUSES].map((s) => (
          <button key={s ?? "all"} onClick={() => filter(s)} className={cn("rounded-full border px-3 py-1 text-sm capitalize", status === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>{s ?? "All"}</button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Ref</TableHead><TableHead>Customer</TableHead><TableHead>Car</TableHead><TableHead>Dates</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Mileage</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {data?.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No bookings.</TableCell></TableRow>}
          {data?.map((b) => (
            <TableRow key={b.id}>
              <TableCell><Link to="/bookings/$bookingId" params={{ bookingId: String(b.id) }} className="font-mono text-xs font-semibold hover:underline">{b.reference}</Link></TableCell>
              <TableCell><p className="font-medium">{b.user?.full_name}</p><p className="text-xs text-muted-foreground">{b.user?.phone}</p></TableCell>
              <TableCell><p>{b.car?.make} {b.car?.model}</p><p className="font-mono text-xs text-muted-foreground">{b.car?.registration_number}</p></TableCell>
              <TableCell className="whitespace-nowrap text-sm">{formatDate(b.start_date)} → {formatDate(b.end_date)}</TableCell>
              <TableCell className="text-right">{formatKES(b.total_amount)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{b.pickup_mileage != null ? `${b.pickup_mileage.toLocaleString()}` : "—"}{b.return_mileage != null && ` → ${b.return_mileage.toLocaleString()}`}</TableCell>
              <TableCell><StatusBadge status={b.status} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {b.status === "pending" && <>
                    <Button size="sm" onClick={() => act.mutate({ kind: "confirm", b })}>Confirm</Button>
                    <Button size="sm" variant="ghost" onClick={() => act.mutate({ kind: "cancel", b })}>Reject</Button>
                  </>}
                  {b.status === "confirmed" && <Button size="sm" onClick={() => setMileage({ b, kind: "pickup", value: String(b.car?.mileage ?? "") })}>Record pickup</Button>}
                  {b.status === "active" && <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => setMileage({ b, kind: "return", value: "" })}>Record return</Button>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!mileage} onOpenChange={(o) => !o && setMileage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mileage?.kind === "pickup" ? "Record pickup" : "Record return"} · {mileage?.b.reference}</DialogTitle>
            <DialogDescription>
              {mileage?.b.car?.make} {mileage?.b.car?.model} — {mileage?.kind === "pickup" ? `last recorded odometer ${mileage?.b.car?.mileage.toLocaleString()} km` : `picked up at ${mileage?.b.pickup_mileage?.toLocaleString()} km`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5"><Label htmlFor="km">Odometer reading (km)</Label><Input id="km" type="number" autoFocus value={mileage?.value ?? ""} onChange={(e) => mileage && setMileage({ ...mileage, value: e.target.value })} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMileage(null)}>Cancel</Button>
            <Button disabled={!mileage?.value || act.isPending} onClick={() => mileage && act.mutate({ kind: mileage.kind, b: mileage.b, km: Number(mileage.value) })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
