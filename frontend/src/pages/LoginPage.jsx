import { useState } from 'react';
import './LoginPage.css';

const ACCESS_TOKEN_KEY = 'access_token';

function PawIcon() {
  return (
    <svg
      className="login-brand__icon"
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="24" cy="34" rx="10" ry="8" />
      <circle cx="12" cy="20" r="6" />
      <circle cx="24" cy="14" r="6" />
      <circle cx="36" cy="20" r="6" />
      <circle cx="8" cy="30" r="5" />
      <circle cx="40" cy="30" r="5" />
    </svg>
  );
}

async function loginRequest(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: email, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    return {
      success: false,
      message: 'Invalid response from server.',
    };
  }

  return data;
}

function getErrorMessage(data) {
  return (
    data?.message ??
    data?.error ??
    data?.detail ??
    'Login failed. Please check your credentials.'
  );
}

function validateFields(email, password) {
  if (!email.trim() || !password.trim()) {
    return 'Please fill all fields before login.';
  }
  return '';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const validationError = validateFields(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = await loginRequest(email.trim(), password);

      if (data.success) {
        const token = data.access_token ?? data.accessToken;
        if (token) {
          sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
        }
        return;
      }

      setError(getErrorMessage(data));
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <PawIcon />
          <h1 className="login-brand__title">VetCare</h1>
          <p className="login-brand__subtitle">Clinic Management</p>
        </div>

        <h2 className="login-heading">Welcome back</h2>
        <p className="login-subheading">Sign in to your clinic account</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <div className="login-error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="login-footer">
        © 2026 VetCare Clinic Management System. All rights reserved.
      </p>
    </div>
  );
}
