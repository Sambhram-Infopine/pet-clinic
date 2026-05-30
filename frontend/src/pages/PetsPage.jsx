import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerById } from '../api/owners.js';
import { createPet, getPetsByOwnerId } from '../api/pets.js';
import { getPetTypes } from '../api/petTypes.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { PawIcon } from '../components/BrandLogo.jsx';
import {
  clearOwnerWorkflow,
  getCurrentOwnerId,
  getCurrentOwnerSnapshot,
  getStoredPets,
  mergePetsById,
  setCurrentOwnerSnapshot,
  setStoredPets,
} from '../constants/owner.js';
import '../components/BrandLogo.css';
import './PetsPage.css';

const EMPTY_PET_FORM = {
  name: '',
  birthDate: '',
  petTypeId: '',
};

function validatePetForm(form) {
  const errors = {};
  const name = form.name.trim();

  if (!name || !form.birthDate || !form.petTypeId) {
    errors.form = 'Please fill all required fields.';
  }

  if (name && name.length < 2) {
    errors.name = 'Pet name must be at least 2 characters.';
  }

  if (form.birthDate) {
    const birth = new Date(form.birthDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (birth > today) {
      errors.birthDate = 'Birth date cannot be in the future.';
    }
  }

  return errors;
}

function formatPetTypeLabel(typeName) {
  return typeName ?? 'Unknown';
}

export default function PetsPage() {
  const navigate = useNavigate();
  const ownerId = getCurrentOwnerId();

  const [owner, setOwner] = useState(null);
  const [petTypes, setPetTypes] = useState([]);
  const [petsAdded, setPetsAdded] = useState(() =>
    ownerId ? getStoredPets(ownerId) : []
  );
  const [form, setForm] = useState(EMPTY_PET_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ownerId) return;

    let cancelled = false;

    async function loadPageData() {
      setPageLoading(true);
      setBannerError('');

      const [ownerResult, typesResult, petsResult] = await Promise.all([
        getOwnerById(ownerId),
        getPetTypes(),
        getPetsByOwnerId(ownerId),
      ]);

      if (cancelled) return;

      if (ownerResult.unauthorized || typesResult.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      const snapshot = getCurrentOwnerSnapshot();
      const snapshotMatchesOwner =
        snapshot?.id != null && String(snapshot.id) === String(ownerId);

      if (ownerResult.success) {
        setOwner(ownerResult.data);
        setCurrentOwnerSnapshot(ownerResult.data);
      } else if (snapshotMatchesOwner) {
        setOwner(snapshot);
      } else {
        setBannerError(ownerResult.message ?? 'Could not load owner.');
        setPageLoading(false);
        return;
      }

      if (!typesResult.success) {
        setBannerError(typesResult.message ?? 'Could not load pet types.');
        setPageLoading(false);
        return;
      }

      setPetTypes(Array.isArray(typesResult.data) ? typesResult.data : []);

      const storedPets = getStoredPets(ownerId);
      const apiPets =
        petsResult.success && Array.isArray(petsResult.data)
          ? petsResult.data
          : [];
      setPetsAdded(mergePetsById(storedPets, apiPets));

      setPageLoading(false);
    }

    loadPageData();

    return () => {
      cancelled = true;
    };
  }, [ownerId, navigate]);

  useEffect(() => {
    if (!ownerId) return;
    setStoredPets(ownerId, petsAdded);
  }, [ownerId, petsAdded]);

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

  function handleClear() {
    setForm(EMPTY_PET_FORM);
    setFieldErrors({});
    setBannerError('');
    setSuccessMessage('');
  }

  async function handleSavePet() {
    setBannerError('');
    setSuccessMessage('');

    const errors = validatePetForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      if (errors.form) setBannerError(errors.form);
      return;
    }

    setSaving(true);

    try {
      const result = await createPet({
        name: form.name.trim(),
        birthDate: form.birthDate,
        ownerId: Number(ownerId),
        petTypeId: Number(form.petTypeId),
      });

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setBannerError(result.message);
        return;
      }

      const pet = result.data;
      if (!pet?.id) {
        setBannerError('Pet saved but no id was returned.');
        return;
      }

      setPetsAdded((prev) => {
        const next = [...prev, pet];
        setStoredPets(ownerId, next);
        return next;
      });
      setSuccessMessage(`${pet.name} was added.`);
      setForm(EMPTY_PET_FORM);
      setFieldErrors({});
    } catch {
      setBannerError('Unable to save pet. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!ownerId) {
    return (
      <div className="pets-page">
        <AppNavbar activeNav="pets" />
        <main className="pets-page__main">
          <div className="pets-page__empty">
            <p>No owner selected. Please add an owner first.</p>
            <button
              type="button"
              className="pets-page__btn"
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

  const ownerName = owner
    ? `${owner.firstName} ${owner.lastName}`.trim()
    : 'Loading…';

  return (
    <div className="pets-page">
      <AppNavbar activeNav="pets" />

      <main className="pets-page__main">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Add Owner', to: '/owners/new' },
            { label: 'Pet Details' },
          ]}
        />

        <header className="pets-page__header">
          <PawIcon className="pets-page__header-icon" />
          <div>
            <h1 className="pets-page__title">Pet Details</h1>
            <p className="pets-page__subtitle">
              Add one or more pets for this owner.
            </p>
          </div>
        </header>

        <div className="pets-page__owner-banner">
          <span className="pets-page__owner-label">Owner:</span>
          <span className="pets-page__owner-name">
            {pageLoading ? 'Loading…' : ownerName}
          </span>
        </div>

        {bannerError ? (
          <div
            className="pets-page__alert pets-page__alert--error"
            role="alert"
          >
            {bannerError}
          </div>
        ) : null}

        {successMessage ? (
          <div
            className="pets-page__alert pets-page__alert--success"
            role="status"
          >
            {successMessage}
          </div>
        ) : null}

        <div className="pets-page__card">
          <div className="pets-page__card-heading">
            <h2 className="pets-page__card-title">Add Pet</h2>
            <span className="pets-page__card-line" aria-hidden="true" />
          </div>

          <form
            className="pets-page__form"
            onSubmit={(e) => e.preventDefault()}
            noValidate
          >
            <div className="pets-page__form-row pets-page__form-row--3">
              <div className="pets-page__field">
                <label htmlFor="petName">
                  Name <span className="pets-page__required">*</span>
                </label>
                <input
                  id="petName"
                  name="name"
                  type="text"
                  placeholder="Enter pet name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={pageLoading || saving}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name ? (
                  <span className="pets-page__field-error">
                    {fieldErrors.name}
                  </span>
                ) : null}
              </div>

              <div className="pets-page__field">
                <label htmlFor="birthDate">
                  Birth Date <span className="pets-page__required">*</span>
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => updateField('birthDate', e.target.value)}
                  disabled={pageLoading || saving}
                  aria-invalid={Boolean(fieldErrors.birthDate)}
                />
                {fieldErrors.birthDate ? (
                  <span className="pets-page__field-error">
                    {fieldErrors.birthDate}
                  </span>
                ) : null}
              </div>

              <div className="pets-page__field">
                <label htmlFor="petTypeId">
                  Pet Type <span className="pets-page__required">*</span>
                </label>
                <select
                  id="petTypeId"
                  name="petTypeId"
                  value={form.petTypeId}
                  onChange={(e) => updateField('petTypeId', e.target.value)}
                  disabled={pageLoading || saving || petTypes.length === 0}
                >
                  <option value="">Select pet type</option>
                  {petTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pets-page__form-actions">
              <button
                type="button"
                className="pets-page__btn pets-page__btn--primary"
                onClick={handleSavePet}
                disabled={pageLoading || saving}
              >
                {saving ? 'Saving…' : '+ Save Pet'}
              </button>
              <button
                type="button"
                className="pets-page__btn pets-page__btn--secondary"
                onClick={handleClear}
                disabled={pageLoading || saving}
              >
                Clear
              </button>
            </div>
            <p className="pets-page__form-hint">
              Save this pet and add another.
            </p>
          </form>
        </div>

        <section className="pets-page__list-section">
          <h2 className="pets-page__list-title">
            Pets Added ({petsAdded.length})
          </h2>

          {petsAdded.length === 0 ? (
            <p className="pets-page__list-empty">No pets added yet.</p>
          ) : (
            <div className="pets-page__table-wrap">
              <table className="pets-page__table">
                <thead>
                  <tr>
                    <th scope="col">Pet name</th>
                    <th scope="col">Pet type</th>
                  </tr>
                </thead>
                <tbody>
                  {petsAdded.map((pet) => (
                    <tr key={pet.id}>
                      <td>{pet.name}</td>
                      <td>{formatPetTypeLabel(pet.petTypeName)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="pets-page__footer-actions">
          <button
            type="button"
            className="pets-page__btn pets-page__btn--outline"
            onClick={() => navigate('/owners/new')}
            disabled={pageLoading || saving}
          >
            ← Back to Owner Details
          </button>
          <button
            type="button"
            className="pets-page__btn pets-page__btn--outline"
            onClick={() => {
              clearOwnerWorkflow();
              navigate('/');
            }}
            disabled={pageLoading || saving}
          >
            Back to Home
          </button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
