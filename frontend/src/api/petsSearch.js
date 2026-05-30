import { apiRequest } from './http.js';

export async function searchPetsByName(name) {
  const params = new URLSearchParams({ name: name.trim() });
  return apiRequest(`/api/pets-search?${params}`);
}
