import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatKES } from "@/lib/pricing";
import type { Car, CarCreate } from "@/lib/types";

export const Route = createFileRoute("/admin/fleet")({ component: Fleet });

const EMPTY: CarCreate = { category_id: 1, make: "", model: "", year: new Date().getFullYear(), registration_number: "", colour: "", transmission: "automatic", fuel_type: "petrol", seats: 5, daily_rate: 5000, mileage: 0, status: "available", primary_image_url: "" };

function Fleet() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "cars"], queryFn: () => api.adminListCars() });
  const [editing, setEditing] = useState<{ id?: number; form: CarCreate } | null>(null);

  const save = useMutation({
    mutationFn: (v: { id?: number; form: CarCreate }) => (v.id ? api.updateCar(v.id, v.form) : api.createCar(v.form)),
    onSuccess: (c) => { toast.success(`${c.make} ${c.model} saved`); setEditing(null); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: (c: Car) => api.updateCar(c.id, { status: c.status === "maintenance" ? "available" : "maintenance" }),
    onSuccess: (c) => { toast.success(`${c.registration_number} is now ${c.status}`); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-xl">Fleet · {data?.filter((c) => c.status !== "retired").length ?? "–"} cars</h2>
        <Button onClick={() => setEditing({ form: EMPTY })} className="gap-2"><Plus className="h-4 w-4" />Add car</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow><TableHead>Car</TableHead><TableHead>Reg.</TableHead><TableHead>Class</TableHead><TableHead className="text-right">Rate/day</TableHead><TableHead className="text-right">Odometer</TableHead><TableHead>Status</TableHead><TableHead>Maintenance</TableHead><TableHead /></TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((c) => (
            <TableRow key={c.id} className={c.status === "retired" ? "opacity-50" : ""}>
              <TableCell><div className="flex items-center gap-3"><img src={c.primary_image_url} alt="" width={64} height={43} loading="lazy" className="h-10 w-14 rounded object-cover" /><span className="font-medium">{c.make} {c.model} <span className="text-muted-foreground">{c.year}</span></span></div></TableCell>
              <TableCell className="font-mono text-xs">{c.registration_number}</TableCell>
              <TableCell>{c.category?.name}</TableCell>
              <TableCell className="text-right">{formatKES(c.daily_rate)}</TableCell>
              <TableCell className="text-right">{c.mileage.toLocaleString()} km</TableCell>
              <TableCell><Badge variant={c.status === "available" ? "secondary" : c.status === "maintenance" ? "destructive" : "outline"} className="capitalize">{c.status}</Badge></TableCell>
              <TableCell><Switch checked={c.status === "maintenance"} disabled={c.status === "retired"} onCheckedChange={() => toggle.mutate(c)} aria-label="Toggle maintenance" /></TableCell>
              <TableCell><Button variant="ghost" size="icon" onClick={() => { const { id, created_at, category, ...form } = c; void created_at; void category; setEditing({ id, form }); }}><Pencil className="h-4 w-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit car" : "Add car"}</DialogTitle></DialogHeader>
          {editing && <CarForm value={editing.form} onChange={(form) => setEditing({ ...editing, form })} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending} onClick={() => {
              const f = editing!.form;
              if (!f.make || !f.model || !f.registration_number) { toast.error("Make, model and registration are required"); return; }
              if (f.daily_rate <= 0) { toast.error("Daily rate must be positive"); return; }
              save.mutate(editing!);
            }}>Save car</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CarForm({ value: v, onChange }: { value: CarCreate; onChange: (v: CarCreate) => void }) {
  const set = <K extends keyof CarCreate>(k: K, val: CarCreate[K]) => onChange({ ...v, [k]: val });
  const txt = (k: "make" | "model" | "registration_number" | "colour", label: string) => (
    <div className="space-y-1.5"><Label>{label}</Label><Input value={v[k]} onChange={(e) => set(k, k === "registration_number" ? e.target.value.toUpperCase() : e.target.value)} /></div>
  );
  const num = (k: "year" | "seats" | "daily_rate" | "mileage", label: string) => (
    <div className="space-y-1.5"><Label>{label}</Label><Input type="number" value={v[k]} onChange={(e) => set(k, Number(e.target.value))} /></div>
  );
  const sel = <K extends "category_id" | "transmission" | "fuel_type" | "status">(k: K, label: string, opts: [string, string][], parse: (s: string) => CarCreate[K]) => (
    <div className="space-y-1.5"><Label>{label}</Label>
      <Select value={String(v[k])} onValueChange={(s) => set(k, parse(s))}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{opts.map(([val, l]) => <SelectItem key={val} value={val}>{l}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {txt("make", "Make")}{txt("model", "Model")}{num("year", "Year")}
      {txt("registration_number", "Registration")}{txt("colour", "Colour")}{num("seats", "Seats")}
      {sel("category_id", "Category", [["1", "Economy"], ["2", "SUV"], ["3", "Luxury"], ["4", "Van"]], Number)}
      {sel("transmission", "Transmission", [["automatic", "Automatic"], ["manual", "Manual"]], (s) => s as CarCreate["transmission"])}
      {sel("fuel_type", "Fuel", [["petrol", "Petrol"], ["diesel", "Diesel"], ["hybrid", "Hybrid"], ["electric", "Electric"]], (s) => s as CarCreate["fuel_type"])}
      {num("daily_rate", "Daily rate (KES)")}{num("mileage", "Odometer (km)")}
      {sel("status", "Status", [["available", "Available"], ["maintenance", "Maintenance"], ["retired", "Retired"]], (s) => s as CarCreate["status"])}
      <div className="space-y-1.5 sm:col-span-3"><Label>Image URL (optional)</Label><Input value={v.primary_image_url} placeholder="Leave blank for a category photo" onChange={(e) => set("primary_image_url", e.target.value)} /></div>
    </div>
  );
}
