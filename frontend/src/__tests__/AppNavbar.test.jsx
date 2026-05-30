import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppNavbar from '../components/AppNavbar.jsx';
import { vi } from 'vitest';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

describe('AppNavbar', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  test('navigates on logout and add owner clicks', () => {
    render(<AppNavbar />);

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });

    fireEvent.click(screen.getByRole('button', { name: /\+ Add Owner/i }));
    expect(navigate).toHaveBeenCalledWith('/owners/new');
  });
});
