// In-browser mock of the FastAPI backend. Each function mirrors one endpoint and
// enforces the same business rules, throwing ApiError(status, detail) like HTTPException.
import economy from "@/assets/car-economy.jpg";
import suv from "@/assets/car-suv.jpg";
import luxury from "@/assets/car-luxury.jpg";
import { BLOCKING_STATUSES, addDays, calculateQuote, daysBetween, overlaps, todayIso } from "../pricing";
import {
  ApiError,
  type Booking,
  type BookingCreate,
  type BookingStatus,
  type Car,
  type CarCreate,
  type CarDetail,
  type CarFilters,
  type CarUpdate,
  type Category,
  type Dashboard,
  type Extra,
  type Paginated,
  type Quote,
  type QuoteRequest,
  type TokenResponse,
  type User,
  type UserUpdate,
} from "../types";
import { TOKEN_KEY } from "./client";

interface DB {
  users: User[];
  categories: Category[];
  cars: Car[];
  extras: Extra[];
  bookings: Booking[];
  seq: number;
}

const STORE = "lsdo-mockdb-v1";
const CATEGORIES: Category[] = [
  { id: 1, name: "Economy", description: "Fuel-sipping city cars" },
  { id: 2, name: "SUV", description: "Safari-ready 4x4s" },
  { id: 3, name: "Luxury", description: "Executive arrivals" },
  { id: 4, name: "Van", description: "Groups and cargo" },
];
const EXTRAS: Extra[] = [
  { id: 1, name: "Child seat", description: "ISOFIX, ages 1–4", price: 500, per_day: true },
  { id: 2, name: "GPS navigation", description: "Offline Kenya maps", price: 400, per_day: true },
  { id: 3, name: "Extra driver", description: "Add a second licensed driver", price: 2500, per_day: false },
];

function seed(): DB {
  const now = new Date().toISOString();
  const t = todayIso();
  const img = (c: number) => (c === 1 ? economy : c === 3 ? luxury : suv);
  const car = (id: number, category_id: number, make: string, model: string, year: number, reg: string, colour: string, transmission: Car["transmission"], fuel_type: Car["fuel_type"], seats: number, daily_rate: number, mileage: number, status: Car["status"] = "available"): Car => ({
    id, category_id, make, model, year, registration_number: reg, colour, transmission, fuel_type, seats, daily_rate, mileage, status, primary_image_url: img(category_id), created_at: now,
  });
  const cars = [
    car(1, 1, "Toyota", "Axio", 2019, "KDK 214A", "White", "automatic", "petrol", 5, 4500, 61200),
    car(2, 1, "Mazda", "Demio", 2020, "KDM 882C", "Silver", "automatic", "petrol", 5, 3800, 48300),
    car(3, 1, "Toyota", "Aqua", 2021, "KDP 117F", "Blue", "automatic", "hybrid", 5, 4200, 33900),
    car(4, 2, "Toyota", "Land Cruiser Prado", 2022, "KDS 450G", "Forest green", "automatic", "diesel", 7, 14500, 41000),
    car(5, 2, "Subaru", "Forester", 2020, "KDN 309B", "Grey", "automatic", "petrol", 5, 8500, 57800),
    car(6, 2, "Nissan", "X-Trail", 2019, "KDJ 776D", "Black", "manual", "petrol", 7, 7800, 72100, "maintenance"),
    car(7, 3, "Mercedes-Benz", "E-Class", 2022, "KDT 001L", "Obsidian black", "automatic", "petrol", 5, 22000, 18500),
    car(8, 3, "BMW", "5 Series", 2021, "KDR 555X", "Carbon black", "automatic", "hybrid", 5, 20000, 26400),
    car(9, 3, "Range Rover", "Velar", 2023, "KDV 777X", "Santorini black", "automatic", "diesel", 5, 28000, 9800),
    car(10, 4, "Toyota", "HiAce", 2020, "KDL 640K", "White", "manual", "diesel", 14, 12000, 88200),
  ];
  const customer: User = { id: 1, full_name: "Wanjiru Kamau", email: "wanjiru@example.co.ke", phone: "+254 712 345 678", role: "customer", licence_number: "DL-0048213", licence_expiry: addDays(t, 900), is_active: true, created_at: now };
  const other: User = { id: 3, full_name: "Otieno Ouma", email: "otieno@example.co.ke", phone: "+254 722 111 222", role: "customer", licence_number: "DL-0099120", licence_expiry: addDays(t, 600), is_active: true, created_at: now };
  const admin: User = { id: 2, full_name: "Grace Mwangi", email: "admin@lasquadradoro.co.ke", phone: "+254 700 000 001", role: "admin", licence_number: null, licence_expiry: null, is_active: true, created_at: now };
  const db: DB = { users: [customer, admin, other], categories: CATEGORIES, cars, extras: EXTRAS, bookings: [], seq: 1040 };
  const mk = (user: User, carId: number, s: number, e: number, status: BookingStatus, extraIds: number[] = [], extra: Partial<Booking> = {}) => {
    const c = cars.find((x) => x.id === carId)!;
    const ex = EXTRAS.filter((x) => extraIds.includes(x.id));
    const start = addDays(t, s), end = addDays(t, e);
    const q = calculateQuote(c.daily_rate, start, end, ex);
    db.seq++;
    db.bookings.push({
      id: db.bookings.length + 1, reference: `LSD-${db.seq}`, user_id: user.id, car_id: carId, start_date: start, end_date: end, actual_return_date: null,
      pickup_location: "JKIA — Jomo Kenyatta Intl. Airport", daily_rate_snapshot: c.daily_rate, days: q.days, subtotal: q.subtotal, extras_total: q.extras_total, extras: ex,
      tax: q.tax, total_amount: q.total_amount, deposit: q.deposit, status, pickup_mileage: null, return_mileage: null, cancelled_at: null, created_at: now, ...extra,
    });
  };
  mk(customer, 4, -20, -15, "completed", [2], { pickup_mileage: 40200, return_mileage: 41000, actual_return_date: addDays(t, -15) });
  mk(other, 7, -2, 3, "active", [], { pickup_mileage: 18100 });
  mk(other, 5, -4, 1, "active", [1], { pickup_mileage: 57200 });
  mk(customer, 1, 3, 7, "confirmed", [1, 2]);
  mk(other, 9, 5, 9, "pending", [3]);
  mk(customer, 8, 12, 15, "pending");
  return db;
}

let memory: DB | null = null;
function load(): DB {
  if (typeof window === "undefined") return (memory ??= seed());
  if (memory) return memory;
  const raw = localStorage.getItem(STORE);
  memory = raw ? (JSON.parse(raw) as DB) : seed();
  save();
  return memory;
}
function save() {
  if (typeof window !== "undefined" && memory) localStorage.setItem(STORE, JSON.stringify(memory));
}
export function resetMockDb() {
  memory = seed();
  save();
}

const delay = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));

function currentUser(db: DB): User {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const id = token?.startsWith("mock-") ? Number(token.slice(5)) : NaN;
  const u = db.users.find((x) => x.id === id);
  if (!u) throw new ApiError(401, "Not authenticated");
  return u;
}
function requireAdmin(db: DB) {
  const u = currentUser(db);
  if (u.role !== "admin") throw new ApiError(403, "Admin access required");
  return u;
}
const withCat = (db: DB, c: Car): Car => ({ ...c, category: db.categories.find((k) => k.id === c.category_id) });
const hydrate = (db: DB, b: Booking): Booking => {
  const u = db.users.find((x) => x.id === b.user_id);
  return { ...b, car: withCat(db, db.cars.find((c) => c.id === b.car_id)!), user: u && { id: u.id, full_name: u.full_name, email: u.email, phone: u.phone } };
};
function carIsFree(db: DB, carId: number, start: string, end: string, exclude?: number) {
  return !db.bookings.some((b) => b.car_id === carId && b.id !== exclude && (BLOCKING_STATUSES as readonly string[]).includes(b.status) && overlaps({ start_date: start, end_date: end }, b));
}
function validateDates(start: string, end: string) {
  if (!start || !end) throw new ApiError(422, "Start and end dates are required");
  if (end <= start) throw new ApiError(422, "End date must be after start date");
  if (start < todayIso()) throw new ApiError(422, "Start date cannot be in the past");
  if (start > addDays(todayIso(), 365)) throw new ApiError(422, "Bookings can start at most 12 months ahead");
}
function findBooking(db: DB, id: number) {
  const b = db.bookings.find((x) => x.id === id);
  if (!b) throw new ApiError(404, "Booking not found");
  return b;
}

export const mock = {
  // ---- auth ----
  async login(email: string, _password: string): Promise<TokenResponse> {
    const db = load();
    const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) throw new ApiError(401, "Incorrect email or password");
    return delay({ access_token: `mock-${u.id}`, token_type: "bearer" as const, user: u });
  },
  async me(): Promise<User> {
    return delay(currentUser(load()), 80);
  },
  async updateMe(data: UserUpdate): Promise<User> {
    const db = load();
    const u = currentUser(db);
    Object.assign(u, data);
    save();
    return delay(u);
  },
  // ---- cars ----
  async listCars(f: CarFilters = {}): Promise<Paginated<Car>> {
    const db = load();
    let items = db.cars.filter((c) => c.status !== "retired");
    if (f.category_id) items = items.filter((c) => c.category_id === f.category_id);
    if (f.transmission) items = items.filter((c) => c.transmission === f.transmission);
    if (f.fuel_type) items = items.filter((c) => c.fuel_type === f.fuel_type);
    if (f.min_rate != null) items = items.filter((c) => c.daily_rate >= f.min_rate!);
    if (f.max_rate != null) items = items.filter((c) => c.daily_rate <= f.max_rate!);
    const page = f.page ?? 1, size = f.size ?? 50;
    return delay({ items: items.slice((page - 1) * size, page * size).map((c) => withCat(db, c)), total: items.length, page, size });
  },
  async availableCars(start: string, end: string, category_id?: number): Promise<Car[]> {
    const db = load();
    validateDates(start, end);
    return delay(db.cars.filter((c) => c.status === "available" && (!category_id || c.category_id === category_id) && carIsFree(db, c.id, start, end)).map((c) => withCat(db, c)));
  },
  async getCar(id: number): Promise<CarDetail> {
    const db = load();
    const c = db.cars.find((x) => x.id === id);
    if (!c) throw new ApiError(404, "Car not found");
    const booked_ranges = db.bookings.filter((b) => b.car_id === id && (BLOCKING_STATUSES as readonly string[]).includes(b.status)).map((b) => ({ start_date: b.start_date, end_date: b.end_date }));
    return delay({ ...withCat(db, c), booked_ranges });
  },
  async adminListCars(): Promise<Car[]> {
    const db = load();
    requireAdmin(db);
    return delay(db.cars.map((c) => withCat(db, c)));
  },
  async createCar(data: CarCreate): Promise<Car> {
    const db = load();
    requireAdmin(db);
    if (db.cars.some((c) => c.registration_number.toUpperCase() === data.registration_number.toUpperCase())) throw new ApiError(409, "Registration number already exists");
    const c: Car = { ...data, primary_image_url: data.primary_image_url || (data.category_id === 1 ? economy : data.category_id === 3 ? luxury : suv), id: Math.max(0, ...db.cars.map((x) => x.id)) + 1, created_at: new Date().toISOString() };
    db.cars.push(c);
    save();
    return delay(withCat(db, c));
  },
  async updateCar(id: number, data: CarUpdate): Promise<Car> {
    const db = load();
    requireAdmin(db);
    const c = db.cars.find((x) => x.id === id);
    if (!c) throw new ApiError(404, "Car not found");
    Object.assign(c, data);
    save();
    return delay(withCat(db, c));
  },
  async deleteCar(id: number): Promise<void> {
    await mock.updateCar(id, { status: "retired" });
  },
  // ---- extras ----
  async listExtras(): Promise<Extra[]> {
    return delay(load().extras, 60);
  },
  // ---- bookings ----
  async quote(req: QuoteRequest): Promise<Quote> {
    const db = load();
    validateDates(req.start_date, req.end_date);
    const c = db.cars.find((x) => x.id === req.car_id);
    if (!c) throw new ApiError(404, "Car not found");
    return delay(calculateQuote(c.daily_rate, req.start_date, req.end_date, db.extras.filter((e) => req.extra_ids.includes(e.id))), 120);
  },
  async createBooking(req: BookingCreate): Promise<Booking> {
    const db = load();
    const u = currentUser(db);
    validateDates(req.start_date, req.end_date);
    const c = db.cars.find((x) => x.id === req.car_id);
    if (!c) throw new ApiError(404, "Car not found");
    if (c.status !== "available") throw new ApiError(409, "This car is not available for booking");
    if (!u.licence_number || !u.licence_expiry) throw new ApiError(422, "Add your driver's licence before booking");
    if (u.licence_expiry < req.end_date) throw new ApiError(422, "Your licence expires before the end of this rental");
    if (db.bookings.filter((b) => b.user_id === u.id && (BLOCKING_STATUSES as readonly string[]).includes(b.status)).length >= 2) throw new ApiError(409, "You already have 2 active bookings");
    if (!carIsFree(db, c.id, req.start_date, req.end_date)) throw new ApiError(409, "Car is already booked for those dates");
    const ex = db.extras.filter((e) => req.extra_ids.includes(e.id));
    const q = calculateQuote(c.daily_rate, req.start_date, req.end_date, ex);
    db.seq++;
    const b: Booking = {
      id: Math.max(0, ...db.bookings.map((x) => x.id)) + 1, reference: `LSD-${db.seq}`, user_id: u.id, car_id: c.id, start_date: req.start_date, end_date: req.end_date,
      actual_return_date: null, pickup_location: req.pickup_location, daily_rate_snapshot: c.daily_rate, days: q.days, subtotal: q.subtotal, extras_total: q.extras_total, extras: ex,
      tax: q.tax, total_amount: q.total_amount, deposit: q.deposit, status: "pending", pickup_mileage: null, return_mileage: null, cancelled_at: null, created_at: new Date().toISOString(),
    };
    db.bookings.push(b);
    save();
    return delay(hydrate(db, b), 400);
  },
  async myBookings(): Promise<Booking[]> {
    const db = load();
    const u = currentUser(db);
    return delay(db.bookings.filter((b) => b.user_id === u.id).sort((a, b) => b.id - a.id).map((b) => hydrate(db, b)));
  },
  async getBooking(id: number): Promise<Booking> {
    const db = load();
    const u = currentUser(db);
    const b = findBooking(db, id);
    if (u.role !== "admin" && b.user_id !== u.id) throw new ApiError(403, "Not your booking");
    return delay(hydrate(db, b));
  },
  async cancelBooking(id: number): Promise<Booking> {
    const db = load();
    const u = currentUser(db);
    const b = findBooking(db, id);
    if (u.role !== "admin" && b.user_id !== u.id) throw new ApiError(403, "Not your booking");
    if (!["pending", "confirmed"].includes(b.status)) throw new ApiError(409, `Cannot cancel a ${b.status} booking`);
    if (todayIso() >= b.start_date) throw new ApiError(409, "Bookings can only be cancelled before the start date");
    b.status = "cancelled";
    b.cancelled_at = new Date().toISOString();
    save();
    return delay(hydrate(db, b));
  },
  // ---- admin ----
  async adminBookings(status?: BookingStatus): Promise<Booking[]> {
    const db = load();
    requireAdmin(db);
    return delay(db.bookings.filter((b) => !status || b.status === status).sort((a, b) => a.start_date.localeCompare(b.start_date)).map((b) => hydrate(db, b)));
  },
  async confirmBooking(id: number): Promise<Booking> {
    const db = load();
    requireAdmin(db);
    const b = findBooking(db, id);
    if (b.status !== "pending") throw new ApiError(409, "Only pending bookings can be confirmed");
    b.status = "confirmed";
    save();
    return delay(hydrate(db, b));
  },
  async pickupBooking(id: number, pickup_mileage: number): Promise<Booking> {
    const db = load();
    requireAdmin(db);
    const b = findBooking(db, id);
    if (b.status !== "confirmed") throw new ApiError(409, "Only confirmed bookings can be picked up");
    const c = db.cars.find((x) => x.id === b.car_id)!;
    if (pickup_mileage < c.mileage) throw new ApiError(422, `Pickup mileage cannot be below the car's recorded ${c.mileage} km`);
    b.status = "active";
    b.pickup_mileage = pickup_mileage;
    save();
    return delay(hydrate(db, b));
  },
  async returnBooking(id: number, return_mileage: number): Promise<Booking> {
    const db = load();
    requireAdmin(db);
    const b = findBooking(db, id);
    if (b.status !== "active") throw new ApiError(409, "Only active bookings can be returned");
    if (return_mileage < (b.pickup_mileage ?? 0)) throw new ApiError(422, "Return mileage cannot be below pickup mileage");
    b.status = "completed";
    b.return_mileage = return_mileage;
    b.actual_return_date = todayIso();
    db.cars.find((x) => x.id === b.car_id)!.mileage = return_mileage;
    save();
    return delay(hydrate(db, b));
  },
  async dashboard(): Promise<Dashboard> {
    const db = load();
    requireAdmin(db);
    const t = todayIso(), month = t.slice(0, 7), week = addDays(t, 7);
    const live = db.bookings.filter((b) => b.status !== "cancelled");
    return delay({
      cars_on_hire: db.bookings.filter((b) => b.status === "active").length,
      monthly_revenue: live.filter((b) => b.start_date.slice(0, 7) === month).reduce((s, b) => s + b.total_amount, 0),
      upcoming_returns: db.bookings.filter((b) => b.status === "active" && b.end_date <= week).sort((a, b) => a.end_date.localeCompare(b.end_date)).map((b) => hydrate(db, b)),
      pending_bookings: db.bookings.filter((b) => b.status === "pending").length,
      fleet_total: db.cars.filter((c) => c.status !== "retired").length,
      fleet_available: db.cars.filter((c) => c.status === "available").length,
      fleet_maintenance: db.cars.filter((c) => c.status === "maintenance").length,
    });
  },
};

export { daysBetween };
