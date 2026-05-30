import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOwner } from '../api/owners.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { setCurrentOwnerId } from '../constants/owner.js';
import './AddOwnerPage.css';

const PHONE_MAX_LENGTH = 10;
const PHONE_PATTERN = /^[0-9]{10}$/;

function sanitizePhone(value) {
  return value.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH);
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  telephoneNumber: '',
};

function validateOwnerForm(form) {
  const errors = {};
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const address = form.address.trim();
  const city = form.city.trim();
  const telephoneNumber = form.telephoneNumber.trim();

  if (!firstName || !lastName || !address || !city || !telephoneNumber) {
    errors.form = 'Please fill all required fields.';
  }

  if (firstName && firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters.';
  }

  if (lastName && lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters.';
  }

  if (telephoneNumber) {
    if (telephoneNumber.length > PHONE_MAX_LENGTH) {
      errors.telephoneNumber = `Telephone number must be at most ${PHONE_MAX_LENGTH} digits.`;
    } else if (!PHONE_PATTERN.test(telephoneNumber)) {
      errors.telephoneNumber = `Telephone number must be exactly ${PHONE_MAX_LENGTH} digits.`;
    }
  }

  return errors;
}

function UserPageIcon() {
  return (
    <svg
      className="add-owner-page__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AddOwnerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });
    if (bannerError) setBannerError('');
    if (successMessage) setSuccessMessage('');
  }

  async function handleSave(nextAction) {
    setBannerError('');
    setSuccessMessage('');

    const errors = validateOwnerForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.form) setBannerError(errors.form);
      return;
    }

    setLoading(true);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      telephoneNumber: form.telephoneNumber.trim(),
    };

    try {
      const result = await createOwner(payload);

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setBannerError(result.message);
        return;
      }

      const owner = result.data;
      if (!owner?.id) {
        setBannerError('Owner saved but no id was returned. Please try again.');
        return;
      }

      setCurrentOwnerId(owner.id);

      if (nextAction === 'pets') {
        navigate('/pets', { replace: true });
        return;
      }

      setSuccessMessage('Owner saved successfully.');
      setTimeout(() => navigate('/', { replace: true }), 800);
    } catch {
      setBannerError('Unable to save owner. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate('/');
  }

  return (
    <div className="add-owner-page">
      <AppNavbar activeNav="owners" />

      <main className="add-owner-page__main">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Add Owner' }]}
        />

        <header className="add-owner-page__header">
          <UserPageIcon />
          <div>
            <h1 className="add-owner-page__title">Add New Owner</h1>
            <p className="add-owner-page__subtitle">
              Enter owner details to create a new owner profile.
            </p>
          </div>
        </header>

        <div className="add-owner-card">
          <div className="add-owner-card__heading">
            <h2 className="add-owner-card__title">Owner Information</h2>
            <span className="add-owner-card__line" aria-hidden="true" />
          </div>

          {bannerError ? (
            <div
              className="add-owner-alert add-owner-alert--error"
              role="alert"
            >
              {bannerError}
            </div>
          ) : null}

          {successMessage ? (
            <div
              className="add-owner-alert add-owner-alert--success"
              role="status"
            >
              {successMessage}
            </div>
          ) : null}

          <form
            className="add-owner-form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="add-owner-form__row">
              <div className="add-owner-field">
                <label htmlFor="firstName">
                  First Name{' '}
                  <span className="add-owner-field__required">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors.firstName)}
                />
                {fieldErrors.firstName ? (
                  <span className="add-owner-field__error">
                    {fieldErrors.firstName}
                  </span>
                ) : null}
              </div>

              <div className="add-owner-field">
                <label htmlFor="lastName">
                  Last Name <span className="add-owner-field__required">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(fieldErrors.lastName)}
                />
                {fieldErrors.lastName ? (
                  <span className="add-owner-field__error">
                    {fieldErrors.lastName}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="add-owner-field">
              <label htmlFor="address">
                Address <span className="add-owner-field__required">*</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="add-owner-field">
              <label htmlFor="city">
                City <span className="add-owner-field__required">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="add-owner-field">
              <label htmlFor="telephoneNumber">
                Telephone Number{' '}
                <span className="add-owner-field__required">*</span>
              </label>
              <input
                id="telephoneNumber"
                name="telephoneNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Enter 10-digit telephone number"
                maxLength={PHONE_MAX_LENGTH}
                value={form.telephoneNumber}
                onChange={(e) =>
                  updateField('telephoneNumber', sanitizePhone(e.target.value))
                }
                disabled={loading}
                aria-invalid={Boolean(fieldErrors.telephoneNumber)}
              />
              {fieldErrors.telephoneNumber ? (
                <span className="add-owner-field__error">
                  {fieldErrors.telephoneNumber}
                </span>
              ) : null}
            </div>

            <div className="add-owner-form__actions">
              <button
                type="button"
                className="add-owner-btn add-owner-btn--secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="add-owner-btn add-owner-btn--outline"
                onClick={() => handleSave('home')}
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <div className="add-owner-form__primary-wrap">
                <button
                  type="button"
                  className="add-owner-btn add-owner-btn--primary"
                  onClick={() => handleSave('pets')}
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Save and Continue to Pet Details'}
                  <span aria-hidden="true">→</span>
                </button>
                <p className="add-owner-form__hint">
                  After saving, you can add and manage this owner&apos;s pets.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
