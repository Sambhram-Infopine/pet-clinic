import { apiRequest } from './http.js';

export async function getVeterinarians() {
  return apiRequest('/api/veterinarians');
}
