import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, MapPin } from "lucide-react";
import { SignInPrompt, StatusBadge } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, formatKES, todayIso } from "@/lib/pricing";
import type { Booking } from "@/lib/types";

export const Route = createFileRoute("/bookings/")({
  head: () => ({
    meta: [
      { title: "My Bookings — La Squadra d'Oro" },
      { name: "description", content: "View your rental history, booking references and cancel upcoming bookings." },
      { property: "og:title", content: "My Bookings — La Squadra d'Oro" },
      { property: "og:description", content: "Your La Squadra d'Oro rental history." },
    ],
  }),
  component: MyBookings,
});

function MyBookings() {
  const { user, ready } = useAuth();
  const q = useQuery({ queryKey: ["bookings", "mine", user?.id], queryFn: () => api.myBookings(), enabled: !!user });
  if (!ready) return null;
  if (!user || user.role !== "customer") return <SignInPrompt role="customer" />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">My bookings</h1>
      <p className="mt-1 text-muted-foreground">Hi {user.full_name.split(" ")[0]} — you can cancel any pending or confirmed booking before its pickup date.</p>
      <div className="mt-8 space-y-4">
        {q.isLoading && [0, 1].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        {q.data?.length === 0 && <p className="py-12 text-center text-muted-foreground">No bookings yet. <Link to="/cars" className="underline">Browse the fleet</Link></p>}
        {q.data?.map((b) => <BookingRow key={b.id} b={b} />)}
      </div>
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  const qc = useQueryClient();
  const cancel = useMutation({
    mutationFn: () => api.cancelBooking(b.id),
    onSuccess: () => { toast.success(`${b.reference} cancelled`); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const cancellable = ["pending", "confirmed"].includes(b.status) && todayIso() < b.start_date;
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
      <img src={b.car?.primary_image_url} alt="" width={160} height={107} loading="lazy" className="h-24 w-36 rounded-lg object-cover" />
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/bookings/$bookingId" params={{ bookingId: String(b.id) }} className="font-mono text-sm font-semibold hover:underline">{b.reference}</Link>
          <StatusBadge status={b.status} />
        </div>
        <p className="mt-1 font-display text-xl">{b.car?.make} {b.car?.model}</p>
        <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(b.start_date)} → {formatDate(b.end_date)}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.pickup_location}</span>
        </p>
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
        <p className="font-semibold">{formatKES(b.total_amount)}</p>
        {cancellable && (
          <AlertDialog>
            <AlertDialogTrigger asChild><Button variant="outline" size="sm">Cancel</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel {b.reference}?</AlertDialogTitle>
                <AlertDialogDescription>The {b.car?.make} {b.car?.model} will be released for {formatDate(b.start_date)} – {formatDate(b.end_date)}.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep booking</AlertDialogCancel>
                <AlertDialogAction onClick={() => cancel.mutate()}>Yes, cancel</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
