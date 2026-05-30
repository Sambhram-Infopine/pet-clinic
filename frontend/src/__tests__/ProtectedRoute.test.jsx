import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

describe('ProtectedRoute', () => {
  beforeEach(() => sessionStorage.clear());

  test('renders children when authenticated', () => {
    sessionStorage.setItem('access_token', 'token');
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Secret Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  test('does not render children when not authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Secret Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Secret Content')).toBeNull();
  });
});
