import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPetsByName } from '../api/petsSearch.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { setOwnerWorkflowFromPetSearch } from '../constants/owner.js';
import './PetLookupPage.css';

function formatPetTypeLabel(typeName) {
  return typeName ?? '—';
}

export default function PetLookupPage() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    const name = searchName.trim();

    if (name.length < 2) {
      setError('Enter at least 2 characters to search.');
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    const result = await searchPetsByName(name);

    setLoading(false);

    if (result.unauthorized) {
      navigate('/login', { replace: true });
      return;
    }

    if (!result.success) {
      setError(result.message ?? 'Could not search pets.');
      setResults([]);
      setSearched(true);
      return;
    }

    setResults(Array.isArray(result.data) ? result.data : []);
    setSearched(true);
  }

  function handleAddVisit(pet) {
    setError('');
    setOwnerWorkflowFromPetSearch(pet);
    navigate(`/visits/new?petId=${pet.petId}`, {
      state: { fromPetLookup: true },
    });
  }

  function handleViewHistory(pet) {
    const params = new URLSearchParams({
      ownerId: String(pet.ownerId),
      petId: String(pet.petId),
    });
    navigate(`/visits?${params}`, {
      state: {
        petName: pet.petName,
        ownerName: pet.ownerName,
      },
    });
  }

  return (
    <div className="pet-lookup-page">
      <AppNavbar activeNav="pets" />

      <main className="pet-lookup-page__main">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Pet Lookup' }]}
        />

        <header className="pet-lookup-page__header">
          <h1 className="pet-lookup-page__title">Pet Lookup</h1>
        </header>

        <form className="pet-lookup-page__search" onSubmit={handleSearch}>
          <input
            type="search"
            className="pet-lookup-page__search-input"
            placeholder="Search by pet name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            disabled={loading}
            aria-label="Search by pet name"
          />
          <button
            type="submit"
            className="pet-lookup-page__search-btn"
            disabled={loading}
          >
            <SearchIcon />
            Search
          </button>
        </form>

        {error ? (
          <div className="pet-lookup-page__alert" role="alert">
            {error}
          </div>
        ) : null}

        <div className="pet-lookup-page__card">
          {loading ? (
            <p className="pet-lookup-page__status">Searching…</p>
          ) : !searched ? (
            <p className="pet-lookup-page__status">
              Search by pet name to see results.
            </p>
          ) : results.length === 0 ? (
            <p className="pet-lookup-page__status">No pets found.</p>
          ) : (
            <>
              <div className="pet-lookup-page__table-wrap">
                <table className="pet-lookup-page__table">
                  <thead>
                    <tr>
                      <th scope="col">Pet name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((pet) => (
                      <tr key={pet.petId}>
                        <td>{pet.petName}</td>
                        <td>{formatPetTypeLabel(pet.petTypeName)}</td>
                        <td>{pet.ownerName}</td>
                        <td>
                          <div className="pet-lookup-page__actions">
                            <button
                              type="button"
                              className="pet-lookup-page__btn pet-lookup-page__btn--primary"
                              onClick={() => handleAddVisit(pet)}
                              disabled={loading}
                            >
                              Add Visit
                            </button>
                            <button
                              type="button"
                              className="pet-lookup-page__btn pet-lookup-page__btn--outline"
                              onClick={() => handleViewHistory(pet)}
                              disabled={loading}
                            >
                              View History
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="pet-lookup-page__count">
                Showing {results.length} pet{results.length === 1 ? '' : 's'}
              </p>
            </>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="pet-lookup-page__search-icon"
    >
      <circle
        cx="9"
        cy="9"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M13 13l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
