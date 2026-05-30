import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getVisitHistory } from '../api/visits.js';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import './VisitHistoryPage.css';

function formatVisitDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function parsePositiveId(value) {
  if (!value) return undefined;
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

export default function VisitHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const ownerId = parsePositiveId(searchParams.get('ownerId'));
  const petId = parsePositiveId(searchParams.get('petId'));

  const filterContext = useMemo(() => {
    const petName = location.state?.petName;
    const ownerName = location.state?.ownerName;
    if (petId && petName) {
      return ownerName
        ? `Visits for ${petName} (${ownerName})`
        : `Visits for ${petName}`;
    }
    if (petId) return 'Visits for selected pet';
    if (ownerId) return 'Visits for selected owner';
    return 'View recent visits across the clinic.';
  }, [location.state, ownerId, petId]);

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadVisits() {
      setLoading(true);
      setError('');

      const result = await getVisitHistory({
        ownerId,
        petId,
      });

      if (cancelled) return;

      if (result.unauthorized) {
        navigate('/login', { replace: true });
        return;
      }

      if (!result.success) {
        setError(result.message ?? 'Could not load visit history.');
        setVisits([]);
        setLoading(false);
        return;
      }

      setVisits(Array.isArray(result.data) ? result.data : []);
      setLoading(false);
    }

    loadVisits();

    return () => {
      cancelled = true;
    };
  }, [navigate, ownerId, petId]);

  const breadcrumbItems = petId
    ? [
        { label: 'Home', to: '/' },
        { label: 'Pet Lookup', to: '/pet-lookup' },
        { label: 'Visit History' },
      ]
    : [{ label: 'Home', to: '/' }, { label: 'Visit History' }];

  return (
    <div className="visit-history-page">
      <AppNavbar activeNav="visits" />

      <main className="visit-history-page__main">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="visit-history-page__header">
          <h1 className="visit-history-page__title">Visit History</h1>
          <p className="visit-history-page__subtitle">{filterContext}</p>
        </header>

        <div className="visit-history-page__card">
          {error ? (
            <div className="visit-history-page__alert" role="alert">
              {error}
            </div>
          ) : null}

          {loading ? (
            <p className="visit-history-page__status">Loading visit history…</p>
          ) : visits.length === 0 ? (
            <p className="visit-history-page__status">No visits found.</p>
          ) : (
            <div className="visit-history-page__table-wrap">
              <table className="visit-history-page__table">
                <thead>
                  <tr>
                    <th scope="col">Visit date</th>
                    {!petId ? <th scope="col">Owner</th> : null}
                    {!petId ? <th scope="col">Pet</th> : null}
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Veterinarian</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.map((visit) => (
                    <tr key={visit.visitId}>
                      <td>{formatVisitDate(visit.visitDate)}</td>
                      {!petId ? <td>{visit.ownerName}</td> : null}
                      {!petId ? (
                        <td>
                          {visit.petName}
                          {visit.petType ? ` (${visit.petType})` : ''}
                        </td>
                      ) : null}
                      <td>{visit.visitType ?? '—'}</td>
                      <td>{visit.description}</td>
                      <td>{visit.veterinarianName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error ? (
            <p className="visit-history-page__count">
              Showing {visits.length} visit{visits.length === 1 ? '' : 's'}
              {!ownerId && !petId ? ' (latest 10)' : ''}
            </p>
          ) : null}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
