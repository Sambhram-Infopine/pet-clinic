export const CURRENT_OWNER_ID_KEY = 'current_owner_id';

export function getCurrentOwnerId() {
  return sessionStorage.getItem(CURRENT_OWNER_ID_KEY);
}

export function setCurrentOwnerId(id) {
  sessionStorage.setItem(CURRENT_OWNER_ID_KEY, String(id));
}

export function clearCurrentOwnerId() {
  sessionStorage.removeItem(CURRENT_OWNER_ID_KEY);
}
