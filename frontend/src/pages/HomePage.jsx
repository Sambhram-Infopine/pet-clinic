import AppFooter from '../components/AppFooter.jsx';
import AppNavbar from '../components/AppNavbar.jsx';
import { PawIcon } from '../components/BrandLogo.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';
import '../components/BrandLogo.css';
import './HomePage.css';

function QuickActionCard({ variant, title, description, buttonLabel, icon }) {
  return (
    <article className={`action-card action-card--${variant}`}>
      <div className={`action-card__icon action-card__icon--${variant}`}>
        {icon}
      </div>
      <h3 className="action-card__title">{title}</h3>
      <p className="action-card__desc">{description}</p>
      <button
        type="button"
        className={`action-card__btn action-card__btn--${variant}`}
      >
        {buttonLabel}
        <span aria-hidden="true">→</span>
      </button>
      <div
        className={`action-card__decor action-card__decor--${variant}`}
        aria-hidden="true"
      />
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">
      <AppNavbar activeNav="home" />

      <main className="home-main">
        <section className="hero">
          <div className="hero__content">
            <h1 className="hero__title">
              Welcome to VetCare <PawIcon className="hero__title-icon" />
            </h1>
            <p className="hero__subtitle">
              Manage owners, pets, visits and veterinarians in one simple place.
            </p>
            <div className="hero__divider" />
            <p className="hero__tagline">
              Your all-in-one solution for better pet care.
            </p>
          </div>
          <div className="hero__visual">
            <HeroIllustration />
          </div>
        </section>

        <section className="quick-actions">
          <h2 className="quick-actions__heading">Quick Actions</h2>
          <div className="quick-actions__grid">
            <QuickActionCard
              variant="blue"
              title="Find Owners"
              description="Search and view owner profiles. Manage their details and pets."
              buttonLabel="Search Owners"
              icon={
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <circle
                    cx="14"
                    cy="12"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M19 17l5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="22"
                    cy="10"
                    r="4"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>
              }
            />
            <QuickActionCard
              variant="green"
              title="Pet Lookup"
              description="Search for a pet and view its profile, visit history and related details."
              buttonLabel="Lookup Pet"
              icon={
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <ellipse cx="16" cy="22" rx="6" ry="5" fill="currentColor" />
                  <circle cx="10" cy="12" r="4" fill="currentColor" />
                  <circle cx="16" cy="8" r="4" fill="currentColor" />
                  <circle cx="22" cy="12" r="4" fill="currentColor" />
                </svg>
              }
            />
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
