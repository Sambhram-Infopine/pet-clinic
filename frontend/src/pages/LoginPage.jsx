import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawIcon } from '../components/BrandLogo.jsx';
import { ACCESS_TOKEN_KEY } from '../constants/auth.js';
import '../components/BrandLogo.css';
import './LoginPage.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      message: response.ok
        ? 'Invalid response from server.'
        : `Request failed (${response.status}). Please try again.`,
    };
  }

  if (!response.ok) {
    return {
      success: false,
      message: getErrorMessage(data),
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
  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password.trim()) {
    return 'Please fill all fields before login.';
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

export default function LoginPage() {
  const navigate = useNavigate();
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
        if (!token) {
          setError(
            'Login succeeded but no access token was returned. Please try again.'
          );
          return;
        }
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
        navigate('/', { replace: true });
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
          <PawIcon className="login-brand__icon" />
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
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
