import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createVisit } from '../api/visits.js';
import { getVeterinarians } from '../api/veterinarians.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import {
  clearOwnerWorkflow,
  getCurrentOwnerId,
  getCurrentOwnerSnapshot,
  getStoredPets,
} from '../constants/owner.js';
import './RecordVisitPage.css';

const DESCRIPTION_MAX = 500;

const EMPTY_FORM = {
  petId: '',
  visitDate: '',
  description: '',
  veterinarianId: '',
};

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatPetAge(birthDateStr) {
  if (!birthDateStr) return '';
  const birth = new Date(`${birthDateStr}T00:00:00`);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (today.getDate() < birth.getDate()) {
    months -= 1;
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  }
  const yearPart = years > 0 ? `${years} year${years === 1 ? '' : 's'}` : '';
  const monthPart =
    months > 0 ? `${months} month${months === 1 ? '' : 's'}` : '';
  if (yearPart && monthPart) return `${yearPart} ${monthPart}`;
  if (yearPart) return yearPart;
  if (monthPart) return monthPart;
  return 'Less than 1 month';
}

function vetDisplayName(vet) {
  return `${vet.firstName} ${vet.lastName}`.trim();
}

function validateForm(form) {
  const errors = {};
  if (
    !form.petId ||
    !form.visitDate ||
    !form.description.trim() ||
    !form.veterinarianId
  ) {
    errors.form = 'Please fill all required fields.';
  }
  if (form.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters.`;
  }
  if (form.visitDate) {
    const visit = new Date(`${form.visitDate}T00:00:00`);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (visit > today) {
      errors.visitDate = 'Visit date cannot be in the future.';
    }
  }
  return errors;
}

function CalendarIcon() {
  return (
    <svg
      className="record-visit-page__header-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M4 9h16M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RecordVisitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ownerId = getCurrentOwnerId();
  const initialPetId = searchParams.get('petId') ?? '';

  const owner = getCurrentOwnerSnapshot();
  const pets = useMemo(
    () => (ownerId ? getStoredPets(ownerId) : []),
    [ownerId],
  );

  const [veterinarians, setVeterinarians] = useState([]);
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    petId: initialPetId,
    visitDate: new Date().toISOString().slice(0, 10),
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const selectedPet = useMemo(
    () => pets.find((p) => String(p.id) === String(form.petId)),
    [pets, form.petId]
  );

  const selectedVet = useMemo(
    () =>
      veterinarians.find((v) => String(v.id) === String(form.veterinarianId)),
    [veterinarians, form.veterinarianId]
  );

  const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.trim() : '';

  useEffect(() => {
    if (!ownerId || pets.length === 0) return;

    let cancelled = false;

    async function loadVets() {
      setPageLoading(true);
      const result = await getVeterinarians();

      if (cancelled) return;

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setBannerError(result.message ?? 'Could not load veterinarians.');
        setPageLoading(false);
        return;
      }

      setVeterinarians(Array.isArray(result.data) ? result.data : []);
      setPageLoading(false);
    }

    loadVets();

    return () => {
      cancelled = true;
    };
  }, [ownerId, pets.length, navigate]);

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

  function setToday() {
    updateField('visitDate', new Date().toISOString().slice(0, 10));
  }

  async function handleSaveVisit() {
    setBannerError('');
    setSuccessMessage('');

    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.form) setBannerError(errors.form);
      return;
    }

    setSaving(true);
    let redirectScheduled = false;

    try {
      const result = await createVisit({
        visitDate: form.visitDate,
        description: form.description.trim(),
        petId: Number(form.petId),
        veterinarianId: Number(form.veterinarianId),
      });

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setBannerError(result.message);
        return;
      }

      setSuccessMessage('Visit saved successfully.');
      redirectScheduled = true;
      window.setTimeout(() => {
        clearOwnerWorkflow();
        navigate('/', { replace: true });
      }, 1500);
      return;
    } catch {
      setBannerError('Unable to save visit. Please try again.');
    } finally {
      if (!redirectScheduled) setSaving(false);
    }
  }

  if (!ownerId || pets.length === 0) {
    return (
      <div className="record-visit-page">
        <AppNavbar activeNav="visits" />
        <main className="record-visit-page__main">
          <div className="record-visit-page__empty">
            <p>Add an owner and at least one pet before recording a visit.</p>
            <button
              type="button"
              className="record-visit-page__btn record-visit-page__btn--primary"
              onClick={() => navigate('/owners/new')}
            >
              Add Owner
            </button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="record-visit-page">
      <AppNavbar activeNav="visits" />

      <main className="record-visit-page__main">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Add Owner', to: '/owners/new' },
            { label: 'Pet Details', to: '/pets' },
            { label: 'Record Visit' },
          ]}
        />

        <header className="record-visit-page__header">
          <CalendarIcon />
          <div>
            <h1 className="record-visit-page__title">Record Visit</h1>
            <p className="record-visit-page__subtitle">
              Enter visit details for the selected pet.
            </p>
          </div>
        </header>

        <div className="record-visit-page__owner-banner">
          <span className="record-visit-page__owner-label">Owner:</span>
          <span className="record-visit-page__owner-name">{ownerName}</span>
        </div>

        {bannerError ? (
          <div
            className="record-visit-page__alert record-visit-page__alert--error"
            role="alert"
          >
            {bannerError}
          </div>
        ) : null}

        {successMessage ? (
          <div
            className="record-visit-page__alert record-visit-page__alert--success"
            role="status"
          >
            {successMessage}
          </div>
        ) : null}

        <div className="record-visit-page__card">
          <form
            className="record-visit-page__form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="record-visit-page__field">
              <label htmlFor="petId">
                Select Pet{' '}
                <span className="record-visit-page__required">*</span>
              </label>
              <select
                id="petId"
                name="petId"
                value={form.petId}
                onChange={(e) => updateField('petId', e.target.value)}
                disabled={pageLoading || saving}
              >
                <option value="">Select pet</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.petTypeName}) •{' '}
                    {formatDisplayDate(pet.birthDate)}
                  </option>
                ))}
              </select>
              {selectedPet ? (
                <span className="record-visit-page__hint">
                  Pet age: {formatPetAge(selectedPet.birthDate)}
                </span>
              ) : null}
            </div>

            <div className="record-visit-page__field">
              <label htmlFor="visitDate">
                Visit Date{' '}
                <span className="record-visit-page__required">*</span>
              </label>
              <input
                id="visitDate"
                name="visitDate"
                type="date"
                value={form.visitDate}
                onChange={(e) => updateField('visitDate', e.target.value)}
                disabled={pageLoading || saving}
              />
              <button
                type="button"
                className="record-visit-page__link-btn"
                onClick={setToday}
                disabled={pageLoading || saving}
              >
                Today
              </button>
            </div>

            <div className="record-visit-page__field">
              <label htmlFor="description">
                Description / Notes{' '}
                <span className="record-visit-page__required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                maxLength={DESCRIPTION_MAX}
                placeholder="Enter description or notes about the visit..."
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={pageLoading || saving}
              />
              <span className="record-visit-page__hint">
                {form.description.length} / {DESCRIPTION_MAX} characters
              </span>
              {fieldErrors.description ? (
                <span className="record-visit-page__field-error">
                  {fieldErrors.description}
                </span>
              ) : null}
            </div>

            <div className="record-visit-page__field">
              <label htmlFor="veterinarianId">
                Assigned Veterinarian{' '}
                <span className="record-visit-page__required">*</span>
              </label>
              <select
                id="veterinarianId"
                name="veterinarianId"
                value={form.veterinarianId}
                onChange={(e) => updateField('veterinarianId', e.target.value)}
                disabled={pageLoading || saving || veterinarians.length === 0}
              >
                <option value="">Select veterinarian</option>
                {veterinarians.map((vet) => (
                  <option key={vet.id} value={vet.id}>
                    {vetDisplayName(vet)}
                  </option>
                ))}
              </select>
              {selectedVet ? (
                <span className="record-visit-page__specialty">
                  Specialty: <strong>{selectedVet.specialty}</strong>
                </span>
              ) : null}
            </div>

            <div className="record-visit-page__actions">
              <button
                type="button"
                className="record-visit-page__btn record-visit-page__btn--outline"
                onClick={() => navigate('/pets')}
                disabled={pageLoading || saving}
              >
                ← Back to Pet Details
              </button>
              <div className="record-visit-page__actions-right">
                <button
                  type="button"
                  className="record-visit-page__btn record-visit-page__btn--secondary"
                  onClick={() => navigate('/pets')}
                  disabled={pageLoading || saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="record-visit-page__btn record-visit-page__btn--primary"
                  onClick={handleSaveVisit}
                  disabled={pageLoading || saving}
                >
                  {saving ? 'Saving…' : 'Save Visit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
