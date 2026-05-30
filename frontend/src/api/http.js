import { getAccessToken } from '../constants/auth.js';

export function parseErrorMessage(data, status) {
  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((e) => e.defaultMessage ?? e.message)
      .filter(Boolean)
      .join(' ');
  }
  if (status === 401) return 'Session expired. Please sign in again.';
  return `Request failed (${status}). Please try again.`;
}

export async function apiRequest(url, options = {}) {
  const token = getAccessToken();
  if (!token) {
    return {
      success: false,
      unauthorized: true,
      message: 'You must be logged in.',
    };
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  let data;
  const hasBody = response.status !== 204;
  if (hasBody) {
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        message: response.ok
          ? 'Invalid response from server.'
          : parseErrorMessage(null, response.status),
      };
    }
  }

  if (!response.ok) {
    return {
      success: false,
      unauthorized: response.status === 401,
      message: parseErrorMessage(data, response.status),
    };
  }

  return { success: true, data };
}
