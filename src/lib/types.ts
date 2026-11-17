export type Role = "customer" | "admin";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  licence_number: string | null;
  licence_expiry: string | null;
  is_active: boolean;
  created_at: string;
}

export interface UserUpdate {
  full_name?: string | undefined;
  phone?: string | undefined;
  licence_number?: string | undefined;
  licence_expiry?: string | undefined;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
  user: User;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export type Transmission = "manual" | "automatic";
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";
export type CarStatus = "available" | "maintenance" | "retired";

export interface Car {
  id: number;
  category_id: number;
  category?: Category | undefined;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  colour: string;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  daily_rate: number;
  mileage: number;
  status: CarStatus;
  primary_image_url: string;
  created_at: string;
}

export type CarCreate = Omit<Car, "id" | "created_at" | "category">;
export type CarUpdate = Partial<CarCreate>;

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface CarDetail extends Car {
  booked_ranges: DateRange[];
}

export interface CarFilters {
  category_id?: number | undefined;
  transmission?: Transmission | undefined;
  fuel_type?: FuelType | undefined;
  min_rate?: number | undefined;
  max_rate?: number | undefined;
  page?: number | undefined;
  size?: number | undefined;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface Extra {
  id: number;
  name: string;
  description: string;
  price: number;
  per_day: boolean;
}

export interface QuoteRequest {
  car_id: number;
  start_date: string;
  end_date: string;
  extra_ids: number[];
}

export interface Quote {
  days: number;
  daily_rate: number;
  subtotal: number;
  extras_total: number;
  tax: number;
  total_amount: number;
  deposit: number;
}

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";

export interface BookingCreate extends QuoteRequest {
  pickup_location: string;
}

export interface Booking {
  id: number;
  reference: string;
  user_id: number;
  car_id: number;
  car?: Car | undefined;
  user?: Pick<User, "id" | "full_name" | "email" | "phone"> | undefined;
  start_date: string;
  end_date: string;
  actual_return_date: string | null;
  pickup_location: string;
  daily_rate_snapshot: number;
  days: number;
  subtotal: number;
  extras_total: number;
  extras: Extra[];
  tax: number;
  total_amount: number;
  deposit: number;
  status: BookingStatus;
  pickup_mileage: number | null;
  return_mileage: number | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface Dashboard {
  cars_on_hire: number;
  monthly_revenue: number;
  upcoming_returns: Booking[];
  pending_bookings: number;
  fleet_total: number;
  fleet_available: number;
  fleet_maintenance: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
  }
}

export const PICKUP_LOCATIONS = [
  "JKIA — Jomo Kenyatta Intl. Airport",
  "Wilson Airport",
  "Westlands — Sarit Centre",
  "Kilimani — Yaya Centre",
  "Karen — The Hub",
  "Nairobi CBD — Kenyatta Avenue",
] as const;
