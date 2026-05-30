export const CURRENT_OWNER_ID_KEY = 'current_owner_id';
export const CURRENT_OWNER_SNAPSHOT_KEY = 'current_owner_snapshot';
export const CURRENT_OWNER_PETS_KEY = 'current_owner_pets';

export function getCurrentOwnerId() {
  return sessionStorage.getItem(CURRENT_OWNER_ID_KEY);
}

export function setCurrentOwnerId(id) {
  const previousId = getCurrentOwnerId();
  sessionStorage.setItem(CURRENT_OWNER_ID_KEY, String(id));

  if (previousId && previousId !== String(id)) {
    clearStoredPets();
  }
}

export function clearCurrentOwnerId() {
  sessionStorage.removeItem(CURRENT_OWNER_ID_KEY);
}

export function getCurrentOwnerSnapshot() {
  const raw = sessionStorage.getItem(CURRENT_OWNER_SNAPSHOT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentOwnerSnapshot(owner) {
  sessionStorage.setItem(CURRENT_OWNER_SNAPSHOT_KEY, JSON.stringify(owner));
}

export function snapshotToForm(snapshot) {
  if (!snapshot) {
    return {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      telephoneNumber: '',
    };
  }

  return {
    firstName: snapshot.firstName ?? '',
    lastName: snapshot.lastName ?? '',
    address: snapshot.address ?? '',
    city: snapshot.city ?? '',
    telephoneNumber: snapshot.telephoneNumber ?? '',
  };
}

export function formToSnapshot(form, id) {
  const snapshot = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    telephoneNumber: form.telephoneNumber.trim(),
  };

  if (id != null) {
    snapshot.id = id;
  }

  return snapshot;
}

export function getStoredPets(ownerId) {
  if (!ownerId) return [];

  const raw = sessionStorage.getItem(CURRENT_OWNER_PETS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (String(parsed.ownerId) !== String(ownerId)) return [];
    return Array.isArray(parsed.pets) ? parsed.pets : [];
  } catch {
    return [];
  }
}

export function setStoredPets(ownerId, pets) {
  if (!ownerId) return;

  sessionStorage.setItem(
    CURRENT_OWNER_PETS_KEY,
    JSON.stringify({ ownerId: String(ownerId), pets })
  );
}

export function clearStoredPets() {
  sessionStorage.removeItem(CURRENT_OWNER_PETS_KEY);
}

export function mergePetsById(storedPets, apiPets) {
  const map = new Map();

  for (const pet of storedPets) {
    if (pet?.id != null) map.set(pet.id, pet);
  }

  for (const pet of apiPets) {
    if (pet?.id != null) map.set(pet.id, pet);
  }

  return Array.from(map.values());
}

export function clearOwnerWorkflow() {
  clearCurrentOwnerId();
  sessionStorage.removeItem(CURRENT_OWNER_SNAPSHOT_KEY);
  clearStoredPets();
}

export function hasSavedOwnerInSession() {
  const id = getCurrentOwnerId();
  const snapshot = getCurrentOwnerSnapshot();
  return Boolean(id && snapshot?.id && String(snapshot.id) === String(id));
}
