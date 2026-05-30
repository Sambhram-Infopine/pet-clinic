import { apiRequest } from './http.js';

export async function createVisit(visit) {
  return apiRequest('/api/visits', {
    method: 'POST',
    body: JSON.stringify(visit),
  });
}

export async function getVisitHistory({ ownerId, petId, date } = {}) {
  const params = new URLSearchParams();
  if (ownerId != null) params.set('ownerId', String(ownerId));
  if (petId != null) params.set('petId', String(petId));
  if (date) params.set('date', date);
  const query = params.toString();
  return apiRequest(`/api/visits${query ? `?${query}` : ''}`);
}
