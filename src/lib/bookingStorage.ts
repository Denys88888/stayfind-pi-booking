export interface Booking {
  id: string;
  hotelName: string;
  hotelId: string;
  roomType: string;
  image: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  totalUsd: number;
  totalPi: number;
  txid?: string;
  bookedAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const KEY = 'stayfind_bookings';

export function getBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveBooking(b: Booking): void {
  const list = getBookings();
  list.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
}

export function cancelBooking(id: string): Booking[] {
  const list = getBookings().map((b) =>
    b.id === id ? { ...b, status: 'cancelled' as const } : b
  );
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export function generateBookingId(): string {
  return 'SF-' + Date.now().toString(36).toUpperCase();
}
