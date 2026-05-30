import { apiRequest } from './http.js';

export async function createPet(pet) {
  return apiRequest('/api/pets', {
    method: 'POST',
    body: JSON.stringify(pet),
  });
}

export async function getPetsByOwnerId(ownerId) {
  return apiRequest(`/api/pets?ownerId=${ownerId}`);
}
