import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVeterinarians } from '../api/veterinarians.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import './VeterinariansPage.css';

export default function VeterinariansPage() {
  const navigate = useNavigate();
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadVeterinarians() {
      setLoading(true);
      setError('');

      const result = await getVeterinarians();

      if (cancelled) return;

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setError(result.message ?? 'Could not load veterinarians.');
        setVeterinarians([]);
        setLoading(false);
        return;
      }

      setVeterinarians(Array.isArray(result.data) ? result.data : []);
      setLoading(false);
    }

    loadVeterinarians();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="vets-page">
      <AppNavbar activeNav="vets" />

      <main className="vets-page__main">
        <Breadcrumbs
          items={[{ label: 'Home', to: '/' }, { label: 'Veterinarians' }]}
        />

        <header className="vets-page__header">
          <h1 className="vets-page__title">Veterinarians</h1>
          <p className="vets-page__subtitle">
            View the list of all registered veterinarians.
          </p>
        </header>

        <div className="vets-page__card">
          {error ? (
            <div className="vets-page__alert" role="alert">
              {error}
            </div>
          ) : null}

          {loading ? (
            <p className="vets-page__status">Loading veterinarians…</p>
          ) : veterinarians.length === 0 ? (
            <p className="vets-page__status">No veterinarians found.</p>
          ) : (
            <div className="vets-page__table-wrap">
              <table className="vets-page__table">
                <thead>
                  <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Specialty</th>
                  </tr>
                </thead>
                <tbody>
                  {veterinarians.map((vet) => (
                    <tr key={vet.id}>
                      <td>{vet.firstName}</td>
                      <td>{vet.lastName}</td>
                      <td>{vet.specialty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error ? (
            <p className="vets-page__count">
              Showing {veterinarians.length} veterinarian
              {veterinarians.length === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
