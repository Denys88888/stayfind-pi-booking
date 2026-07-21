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
}

export type NewListing = Pick<
  Listing,
  'ownerUid' | 'name' | 'location' | 'address' | 'price' | 'description' | 'images' | 'amenities' | 'propertyType'
>;

const API_URL = import.meta.env.VITE_API_URL || 'https://stayfind-api.onrender.com';

export async function createListing(data: NewListing): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/listings`, {
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

export async function fetchMyListings(piUid: string): Promise<Listing[]> {
  try {
    const res = await fetch(`${API_URL}/api/listings/owner/${encodeURIComponent(piUid)}`);
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

/** Listing ids are Date.now()-based (13+ digits) — always far larger than the
 * static catalog's small sequential ids, so this is a safe way to tell them apart. */
export function isListingId(id: number): boolean {
  return id > 100000;
}
