import { apiRequest } from './http.js';

export async function createOwner(owner) {
  return apiRequest('/api/owners', {
    method: 'POST',
    body: JSON.stringify(owner),
  });
}

export async function getOwnerById(id) {
  return apiRequest(`/api/owners/${id}`);
}
