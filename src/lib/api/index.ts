import type {
  Booking, BookingCreate, BookingStatus, Car, CarCreate, CarDetail, CarFilters, CarUpdate,
  Dashboard, Extra, Paginated, Quote, QuoteRequest, TokenResponse, User, UserUpdate,
} from "../types";
import { USE_MOCK, http } from "./client";
import { mock } from "./mock";

const d = <T,>(p: Promise<{ data: T }>) => p.then((r) => r.data);

function resolveCar<T extends Car>(car: T): T {
  if (!car) return car;
  const c = { ...car };
  if (!c.colour && (c as unknown as { color?: string }).color) {
    c.colour = (c as unknown as { color: string }).color;
  }
  if (c.primary_image_url && !c.primary_image_url.startsWith("http://") && !c.primary_image_url.startsWith("https://") && !c.primary_image_url.startsWith("data:")) {
    const base = (http.defaults.baseURL ?? "http://localhost:8000").replace(/\/+$/, "");
    const path = c.primary_image_url.replace(/^\/+/, "");
    c.primary_image_url = `${base}/${path}`;
  }
  return c;
}

function resolveBooking(b: Booking): Booking {
  if (!b) return b;
  return {
    ...b,
    car: b.car ? resolveCar(b.car) : b.car,
  };
}

const real = {
  login: (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password });
    return d<TokenResponse>(http.post("/auth/login", form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }));
  },
  me: () => d<User>(http.get("/auth/me")),
  updateMe: (data: UserUpdate) => d<User>(http.patch("/auth/me", data)),
  listCars: (f: CarFilters = {}) => d<Paginated<Car>>(http.get("/cars", { params: f })).then((p) => ({ ...p, items: p.items.map(resolveCar) })),
  availableCars: (start: string, end: string, category_id?: number) => d<Car[]>(http.get("/cars/available", { params: { start, end, category: category_id } })).then((items) => items.map(resolveCar)),
  getCar: (id: number) => d<CarDetail>(http.get(`/cars/${id}`)).then(resolveCar),
  adminListCars: () => d<Car[]>(http.get("/cars", { params: { include_all: true, size: 200 } }).then((r) => ({ data: (r.data as Paginated<Car>).items }))).then((items) => items.map(resolveCar)),
  createCar: (data: CarCreate) => d<Car>(http.post("/cars", data)).then(resolveCar),
  updateCar: (id: number, data: CarUpdate) => d<Car>(http.patch(`/cars/${id}`, data)).then(resolveCar),
  deleteCar: (id: number) => d<void>(http.delete(`/cars/${id}`)),
  listExtras: () => d<Extra[]>(http.get("/extras")),
  quote: (req: QuoteRequest) => d<Quote>(http.post("/bookings/quote", req)),
  createBooking: (req: BookingCreate) => d<Booking>(http.post("/bookings", req)).then(resolveBooking),
  myBookings: () => d<Booking[]>(http.get("/bookings/mine")).then((items) => items.map(resolveBooking)),
  getBooking: (id: number) => d<Booking>(http.get(`/bookings/${id}`)).then(resolveBooking),
  cancelBooking: (id: number) => d<Booking>(http.post(`/bookings/${id}/cancel`)).then(resolveBooking),
  adminBookings: (status?: BookingStatus) => d<Booking[]>(http.get("/admin/bookings", { params: { status } })).then((items) => items.map(resolveBooking)),
  confirmBooking: (id: number) => d<Booking>(http.post(`/admin/bookings/${id}/confirm`)).then(resolveBooking),
  pickupBooking: (id: number, pickup_mileage: number) => d<Booking>(http.post(`/admin/bookings/${id}/pickup`, { pickup_mileage })).then(resolveBooking),
  returnBooking: (id: number, return_mileage: number) => d<Booking>(http.post(`/admin/bookings/${id}/return`, { return_mileage })).then(resolveBooking),
  dashboard: () => d<Dashboard>(http.get("/admin/dashboard")).then((dash) => ({
    ...dash,
    upcoming_returns: dash.upcoming_returns.map(resolveBooking),
  })),
};

export const api: typeof real = USE_MOCK ? mock : real;
