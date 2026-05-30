import { apiRequest } from './http.js';

export async function createVisit(visit) {
  return apiRequest('/api/visits', {
    method: 'POST',
    body: JSON.stringify(visit),
  });
}
