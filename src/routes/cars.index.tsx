import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CarCard, SearchWidget } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { api } from "@/lib/api";
import { formatDate, formatKES } from "@/lib/pricing";
import type { FuelType, Transmission } from "@/lib/types";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  category: z.number().optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  fuel: z.enum(["petrol", "diesel", "hybrid", "electric"]).optional(),
  max: z.number().optional(),
});

export const Route = createFileRoute("/cars/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse the Fleet — La Squadra d'Oro" },
      { name: "description", content: "Filter Nairobi rental cars by category, transmission, fuel and daily rate, and check availability for your dates." },
      { property: "og:title", content: "Browse the Fleet — La Squadra d'Oro" },
      { property: "og:description", content: "Economy, SUV, luxury and vans available for your dates in Nairobi." },
    ],
  }),
  component: CarsPage,
});

const CATS = [[1, "Economy"], [2, "SUV"], [3, "Luxury"], [4, "Van"]] as const;

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("rounded-full border px-3 py-1 text-sm capitalize transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>{children}</button>;
}

function CarsPage() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();
  const set = (patch: Partial<typeof s>) => navigate({ to: ".", search: (p) => ({ ...p, ...patch }), replace: true });
  const hasDates = !!(s.start && s.end);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cars", s],
    queryFn: async () => {
      const list = hasDates ? await api.availableCars(s.start!, s.end!, s.category) : (await api.listCars({ category_id: s.category })).items;
      return list.filter((c) => (!s.transmission || c.transmission === s.transmission) && (!s.fuel || c.fuel_type === s.fuel) && (!s.max || c.daily_rate <= s.max));
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl">The fleet</h1>
      <p className="mt-1 text-muted-foreground">{hasDates ? `Cars free from ${formatDate(s.start!)} to ${formatDate(s.end!)}` : "Pick dates to see only cars that are free."}</p>
      <SearchWidget key={`${s.start}${s.end}${s.category}`} className="mt-6 shadow-sm" initial={{ start: s.start, end: s.end, category: s.category }} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <div className="space-y-2"><Label>Category</Label><div className="flex flex-wrap gap-2">
            <Chip on={!s.category} onClick={() => set({ category: undefined })}>All</Chip>
            {CATS.map(([id, n]) => <Chip key={id} on={s.category === id} onClick={() => set({ category: id })}>{n}</Chip>)}
          </div></div>
          <div className="space-y-2"><Label>Transmission</Label><div className="flex flex-wrap gap-2">
            {(["automatic", "manual"] as Transmission[]).map((t) => <Chip key={t} on={s.transmission === t} onClick={() => set({ transmission: s.transmission === t ? undefined : t })}>{t}</Chip>)}
          </div></div>
          <div className="space-y-2"><Label>Fuel</Label><div className="flex flex-wrap gap-2">
            {(["petrol", "diesel", "hybrid", "electric"] as FuelType[]).map((t) => <Chip key={t} on={s.fuel === t} onClick={() => set({ fuel: s.fuel === t ? undefined : t })}>{t}</Chip>)}
          </div></div>
          <div className="space-y-3"><Label>Max daily rate: {formatKES(s.max ?? 30000)}</Label>
            <Slider min={3000} max={30000} step={500} value={[s.max ?? 30000]} onValueChange={([v = 30000]) => set({ max: v >= 30000 ? undefined : v })} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: ".", search: {} })}>Clear all</Button>
        </aside>

        <div>
          {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{(error as Error).message}</p>}
          <p className="mb-4 text-sm text-muted-foreground">{data ? `${data.length} cars` : " "}</p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading ? [0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="aspect-[4/3] rounded-xl" />) : data?.map((c) => <CarCard key={c.id} car={c} search={hasDates ? { start: s.start, end: s.end } : undefined} />)}
          </div>
          {data?.length === 0 && <p className="py-16 text-center text-muted-foreground">No cars match. Try other dates or loosen the filters.</p>}
        </div>
      </div>
    </div>
  );
}
