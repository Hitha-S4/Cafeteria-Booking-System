export type UserRole = "employee" | "manager" | "admin" | "head" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  blueDollars: number;
  avatar?: string;
  managerName?: string;
  autoApprove: boolean;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}

export interface Cafetaria {
  id: string;
  name: string;
  locationId: string;
  totalSeats: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Seat {
  id: string;
  cafetariaId: string;
  seatNumber: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  date: string; // LocalDate (e.g., "2025-05-04")
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string; // LocalDateTime (e.g., "2025-05-03T15:00:00")

  seatId: string;
  seatName: string;

  slotId: string;
  slotTime: string;

  cafeteriaId: string;
  cafeteriaName: string;

  locationId: string;
  locationName: string;

  userId: string;
  name: string;

  managerId: string;
  managerName: string;

  cost: number;
}

export interface BookingFilter {
  locationId?: string;
  cafetariaId?: string;
  date?: string;
  status?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  managerId?: string;
}
