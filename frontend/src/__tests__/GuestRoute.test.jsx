import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GuestRoute from '../components/GuestRoute.jsx';

describe('GuestRoute', () => {
  beforeEach(() => sessionStorage.clear());

  test('renders children when not authenticated', () => {
    render(
      <MemoryRouter>
        <GuestRoute>
          <div>Guest Content</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Guest Content')).toBeInTheDocument();
  });

  test('does not render children when authenticated', () => {
    sessionStorage.setItem('access_token', 'token');
    render(
      <MemoryRouter>
        <GuestRoute>
          <div>Guest Content</div>
        </GuestRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Guest Content')).toBeNull();
  });
});
