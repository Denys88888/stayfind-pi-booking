export interface Review {
  id: string;
  bookingId: string;
  hotelId: string;
  piUid: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';

export async function fetchReviews(hotelId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/api/reviews/${encodeURIComponent(hotelId)}`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function submitReview(data: {
  bookingId: string;
  piUid: string;
  rating: number;
  text: string;
  authorName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { ok: false, error: d.error || `Failed: ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
