import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CarCard, SearchWidget } from "@/components/site";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Squadra d'Oro — Premium Car Rental in Nairobi" },
      { name: "description", content: "Book economy, SUV, luxury and van rentals across Nairobi. Live KES quotes with VAT, airport pickup at JKIA and Wilson." },
      { property: "og:title", content: "La Squadra d'Oro — Premium Car Rental in Nairobi" },
      { property: "og:description", content: "Live KES quotes, airport pickup, and a fleet ready for city or safari." },
    ],
  }),
  component: Home,
});

const CATS = [
  { id: 1, name: "Economy", blurb: "From KES 3,800/day" },
  { id: 2, name: "SUV", blurb: "Safari-ready 4x4s" },
  { id: 3, name: "Luxury", blurb: "Executive arrivals" },
  { id: 4, name: "Van", blurb: "Up to 14 seats" },
];

function Home() {
  const { data, isLoading } = useQuery({ queryKey: ["cars", "featured"], queryFn: () => api.listCars({}) });
  const featured = data?.items.filter((c) => c.status === "available").sort((a, b) => b.daily_rate - a.daily_rate).slice(0, 3);
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Black SUV overlooking the Nairobi skyline at sunset" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:pb-24 md:pt-36">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Nairobi · Since 2026</p>
          <h1 className="max-w-2xl text-5xl leading-[1.05] text-primary-foreground md:text-7xl">
            Drive Nairobi <em className="text-gold">in gold.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-primary-foreground/80">
            Hand-picked cars, delivered to JKIA, Westlands or your door. One clear price in shillings — VAT and deposit shown before you book.
          </p>
          <SearchWidget className="mt-10 max-w-4xl" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl">Choose your class</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATS.map((c) => (
            <Link key={c.id} to="/cars" search={{ category: c.id }} className="group rounded-xl border bg-card p-6 transition-colors hover:border-gold">
              <p className="font-display text-2xl">{c.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
              <ArrowRight className="mt-6 h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Featured</p>
            <h2 className="text-3xl">The headline fleet</h2>
          </div>
          <Link to="/cars" className="text-sm font-semibold underline-offset-4 hover:underline">View all cars →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {isLoading || !featured ? [0, 1, 2].map((i) => <Skeleton key={i} className="aspect-[4/3] rounded-xl" />) : featured.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        {[
          { t: "Airport handover", d: "Meet-and-greet at JKIA and Wilson." },
          { t: "Honest pricing", d: "Subtotal, 16% VAT and 20% deposit upfront." },
          { t: "Inspected fleet", d: "Every car serviced between hires." },
          { t: "Six Nairobi hubs", d: "Westlands, Kilimani, Karen, CBD and more." },
        ].map(({ t, d }) => (
          <div key={t}>
            <p className="font-semibold">{t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </>
  );
}
