import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo.jsx';
import { clearAccessToken } from '../constants/auth.js';
import { clearOwnerWorkflow } from '../constants/owner.js';
import './BrandLogo.css';
import './AppNavbar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/', icon: 'home' },
  { id: 'owners', label: 'Find Owners', path: null, icon: 'search' },
  { id: 'pets', label: 'Pet Lookup', path: '/pets', icon: 'paw' },
  {
    id: 'vets',
    label: 'Veterinarians',
    path: '/veterinarians',
    icon: 'person',
  },
  { id: 'visits', label: 'Visit History', path: null, icon: 'calendar' },
];

function NavIcon({ name }) {
  const icons = {
    home: (
      <path
        d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 20v-9.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    ),
    search: (
      <>
        <circle
          cx="11"
          cy="11"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M16 16l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    paw: (
      <>
        <ellipse cx="12" cy="16" rx="4" ry="3" fill="currentColor" />
        <circle cx="7" cy="10" r="2.5" fill="currentColor" />
        <circle cx="12" cy="7" r="2.5" fill="currentColor" />
        <circle cx="17" cy="10" r="2.5" fill="currentColor" />
      </>
    ),
    person: (
      <>
        <circle
          cx="12"
          cy="8"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </>
    ),
    calendar: (
      <>
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
      </>
    ),
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

export default function AppNavbar({ activeNav = 'home' }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAccessToken();
    clearOwnerWorkflow();
    navigate('/login', { replace: true });
  }

  function handleNavClick(item, event) {
    event.preventDefault();
    if (item.path) {
      navigate(item.path);
    }
  }

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">
        <button
          type="button"
          className="app-navbar__logo-btn"
          onClick={() => navigate('/')}
          aria-label="Go to home"
        >
          <BrandLogo />
        </button>

        <nav className="app-navbar__nav" aria-label="Main">
          <ul className="app-navbar__links">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.path ?? '#'}
                  className={`app-navbar__link ${item.id === activeNav ? 'app-navbar__link--active' : ''}`}
                  aria-current={item.id === activeNav ? 'page' : undefined}
                  onClick={(e) => handleNavClick(item, e)}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-navbar__actions">
          <button
            type="button"
            className="app-navbar__btn-primary"
            onClick={() => {
              clearOwnerWorkflow();
              navigate('/owners/new', { state: { reset: Date.now() } });
            }}
          >
            + Add Owner
          </button>
          <div className="app-navbar__user">
            <div className="app-navbar__profile">
              <span className="app-navbar__avatar" aria-hidden="true">
                <svg
                  className="app-navbar__user-icon"
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
              </span>
              <span className="app-navbar__role">Admin</span>
            </div>
            <button
              type="button"
              className="app-navbar__logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
