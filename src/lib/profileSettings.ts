export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  piAddress: string;
}

const EMPTY: ProfileSettings = { firstName: '', lastName: '', email: '', phone: '', piAddress: '' };

function key(piUid: string): string {
  return `stayfind_profile_${piUid}`;
}

export function getProfileSettings(piUid: string): ProfileSettings {
  try {
    const raw = localStorage.getItem(key(piUid));
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveProfileSettings(piUid: string, settings: ProfileSettings): void {
  localStorage.setItem(key(piUid), JSON.stringify(settings));
}
