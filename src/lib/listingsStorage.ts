export interface Listing {
  id: number;
  ownerUid: string;
  name: string;
  location: string;
  address: string;
  price: number;
  description: string;
  images: string[];
  amenities: string[];
  propertyType: string;
  coordinates: [number, number] | null;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  blockedRanges?: { checkIn: string; checkOut: string }[];
}

export type NewListing = Pick<
  Listing,
  'ownerUid' | 'name' | 'location' | 'address' | 'price' | 'description' | 'images' | 'amenities' | 'propertyType'
>;

const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';

export async function createListing(data: NewListing, accessToken?: string): Promise<{ ok: boolean; error?: string }> {
  if (!accessToken) return { ok: false, error: 'Not signed in' };
  try {
    const res = await fetch(`${API_URL}/api/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
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

export async function fetchApprovedListings(): Promise<Listing[]> {
  try {
    const res = await fetch(`${API_URL}/api/listings`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function fetchListing(id: string): Promise<Listing | null> {
  try {
    const res = await fetch(`${API_URL}/api/listings/${id}`);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function fetchMyListings(piUid: string, accessToken?: string): Promise<Listing[]> {
  if (!accessToken) return [];
  try {
    const res = await fetch(`${API_URL}/api/listings/owner/${encodeURIComponent(piUid)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function blockDates(
  listingId: number,
  checkIn: string,
  checkOut: string,
  accessToken?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!accessToken) return { ok: false, error: 'Not signed in' };
  try {
    const res = await fetch(`${API_URL}/api/listings/${listingId}/block-dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ checkIn, checkOut }),
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

export async function unblockDates(
  listingId: number,
  index: number,
  accessToken?: string
): Promise<{ ok: boolean; error?: string }> {
  if (!accessToken) return { ok: false, error: 'Not signed in' };
  try {
    const res = await fetch(`${API_URL}/api/listings/${listingId}/unblock-dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ index }),
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

/** Listing ids are Date.now()-based (13+ digits) — always far larger than the
 * static catalog's small sequential ids, so this is a safe way to tell them apart. */
export function isListingId(id: number): boolean {
  return id > 100000;
}
