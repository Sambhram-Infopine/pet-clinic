import { apiRequest } from './http.js';

export async function getPetTypes() {
  return apiRequest('/api/pet-types');
}
