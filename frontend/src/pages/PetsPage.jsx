import { useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import { getCurrentOwnerId } from '../constants/owner.js';
import './PetsPage.css';

export default function PetsPage() {
  const navigate = useNavigate();
  const ownerId = getCurrentOwnerId();

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
          <h1 className="pets-page__title">Pet Details</h1>
          <p className="pets-page__subtitle">
            Add and manage pets for owner ID <strong>{ownerId}</strong>.
          </p>
        </header>

        <div className="pets-page__card">
          <p>
            Pet registration form coming next. Owner id is stored and ready to
            use.
          </p>
          <button
            type="button"
            className="pets-page__btn pets-page__btn--secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
