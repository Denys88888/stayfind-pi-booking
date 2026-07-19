import { useCallback, useEffect, useState } from 'react';

const KEY = 'stayfind_favorites';

function read(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function write(ids: number[]): void {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('stayfind:favorites-changed'));
}

export function getFavoriteIds(): number[] {
  return read();
}

export function isFavorite(hotelId: number): boolean {
  return read().includes(hotelId);
}

export function toggleFavorite(hotelId: number): boolean {
  const ids = read();
  const idx = ids.indexOf(hotelId);
  if (idx === -1) {
    ids.push(hotelId);
    write(ids);
    return true;
  }
  ids.splice(idx, 1);
  write(ids);
  return false;
}

export function useIsFavorite(hotelId: number): [boolean, () => void] {
  const [fav, setFav] = useState(() => isFavorite(hotelId));

  useEffect(() => {
    const sync = () => setFav(isFavorite(hotelId));
    sync();
    window.addEventListener('stayfind:favorites-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('stayfind:favorites-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, [hotelId]);

  const toggle = useCallback(() => {
    setFav(toggleFavorite(hotelId));
  }, [hotelId]);

  return [fav, toggle];
}

export function useFavoriteIds(): number[] {
  const [ids, setIds] = useState<number[]>(() => getFavoriteIds());

  useEffect(() => {
    const sync = () => setIds(getFavoriteIds());
    sync();
    window.addEventListener('stayfind:favorites-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('stayfind:favorites-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return ids;
}
