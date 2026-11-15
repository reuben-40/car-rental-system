// Single API surface for the app. Every method maps 1:1 to a FastAPI endpoint;
// with USE_MOCK it routes to the in-browser mock instead of Axios.
import type {
  Booking, BookingCreate, BookingStatus, Car, CarCreate, CarDetail, CarFilters, CarUpdate,
  Dashboard, Extra, Paginated, Quote, QuoteRequest, TokenResponse, User, UserUpdate,
} from "../types";
import { USE_MOCK, http } from "./client";
import { mock } from "./mock";

const d = <T,>(p: Promise<{ data: T }>) => p.then((r) => r.data);

const real = {
  login: (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password }); // OAuth2PasswordRequestForm
    return d<TokenResponse>(http.post("/auth/login", form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }));
  },
  me: () => d<User>(http.get("/auth/me")),
  updateMe: (data: UserUpdate) => d<User>(http.patch("/auth/me", data)),
  listCars: (f: CarFilters = {}) => d<Paginated<Car>>(http.get("/cars", { params: f })),
  availableCars: (start: string, end: string, category_id?: number) => d<Car[]>(http.get("/cars/available", { params: { start, end, category: category_id } })),
  getCar: (id: number) => d<CarDetail>(http.get(`/cars/${id}`)),
  adminListCars: () => d<Car[]>(http.get("/cars", { params: { include_all: true, size: 200 } }).then((r) => ({ data: (r.data as Paginated<Car>).items }))),
  createCar: (data: CarCreate) => d<Car>(http.post("/cars", data)),
  updateCar: (id: number, data: CarUpdate) => d<Car>(http.patch(`/cars/${id}`, data)),
  deleteCar: (id: number) => d<void>(http.delete(`/cars/${id}`)),
  listExtras: () => d<Extra[]>(http.get("/extras")),
  quote: (req: QuoteRequest) => d<Quote>(http.post("/bookings/quote", req)),
  createBooking: (req: BookingCreate) => d<Booking>(http.post("/bookings", req)),
  myBookings: () => d<Booking[]>(http.get("/bookings/mine")),
  getBooking: (id: number) => d<Booking>(http.get(`/bookings/${id}`)),
  cancelBooking: (id: number) => d<Booking>(http.post(`/bookings/${id}/cancel`)),
  adminBookings: (status?: BookingStatus) => d<Booking[]>(http.get("/admin/bookings", { params: { status } })),
  confirmBooking: (id: number) => d<Booking>(http.post(`/admin/bookings/${id}/confirm`)),
  pickupBooking: (id: number, pickup_mileage: number) => d<Booking>(http.post(`/admin/bookings/${id}/pickup`, { pickup_mileage })),
  returnBooking: (id: number, return_mileage: number) => d<Booking>(http.post(`/admin/bookings/${id}/return`, { return_mileage })),
  dashboard: () => d<Dashboard>(http.get("/admin/dashboard")),
};

export const api: typeof real = USE_MOCK ? mock : real;
