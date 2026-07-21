export interface Booking {
  id: string;
  piUid?: string;
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
  refundStatus?: 'processing' | 'completed' | 'failed' | 'pending_manual';
  refundTxid?: string;
  hostUid?: string;
  hostPayoutAmount?: number;
  hostPayoutStatus?: 'held' | 'processing' | 'completed' | 'failed' | 'pending_manual' | 'cancelled';
  platformFeeAmount?: number;
}

const KEY = 'stayfind_bookings';
const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';

/* ── Local cache (offline fallback / instant read) ── */
export function getBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function cacheBookings(list: Booking[]): void {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
}

export function saveBooking(b: Booking): void {
  const list = getBookings();
  list.unshift(b);
  cacheBookings(list);
}

export function cancelBooking(id: string): Booking[] {
  const list = getBookings().map((b) =>
    b.id === id ? { ...b, status: 'cancelled' as const } : b
  );
  cacheBookings(list);
  return list;
}

export function generateBookingId(): string {
  return 'SF-' + Date.now().toString(36).toUpperCase();
}

/* ── Backend-backed bookings (source of truth) ──
 * Bookings persist server-side keyed by Pi uid, so they survive
 * localStorage clears and are visible across devices. localStorage is
 * kept as a best-effort cache in case the backend is briefly unreachable. */

export async function checkAvailability(
  hotelId: string,
  roomType: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  try {
    const params = new URLSearchParams({ hotelId, roomType, checkIn, checkOut });
    const res = await fetch(`${API_URL}/api/bookings/availability?${params}`);
    if (!res.ok) return true; // fail open — don't block booking on a backend hiccup
    const data = await res.json();
    return data.available !== false;
  } catch {
    return true;
  }
}

export async function checkRealPaymentEligibility(
  hotelId: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/bookings/real-payment-eligibility?hotelId=${encodeURIComponent(hotelId)}`);
    if (!res.ok) return { allowed: true }; // fail open — don't block on a backend hiccup
    return await res.json();
  } catch {
    return { allowed: true };
  }
}

export async function createBookingRemote(
  piUid: string,
  booking: Booking
): Promise<{ ok: boolean; error?: string }> {
  const payload = { ...booking, piUid };
  saveBooking(payload); // optimistic local cache
  try {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error || `Booking save failed: ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function fetchBookingsRemote(piUid: string): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${encodeURIComponent(piUid)}`);
    if (!res.ok) return getBookings();
    const list: Booking[] = await res.json();
    cacheBookings(list);
    return list;
  } catch {
    return getBookings();
  }
}

export async function fetchHostEarnings(hostUid: string): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/api/bookings/host/${encodeURIComponent(hostUid)}`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function cancelBookingRemote(piUid: string, id: string): Promise<Booking[]> {
  cancelBooking(id); // optimistic local cache
  try {
    const res = await fetch(`${API_URL}/api/bookings/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ piUid }),
    });
    if (res.ok) return fetchBookingsRemote(piUid);
  } catch {
    /* keep local cancellation */
  }
  return getBookings();
}
