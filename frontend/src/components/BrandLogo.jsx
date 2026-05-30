export function PawIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="24" cy="34" rx="10" ry="8" />
      <circle cx="12" cy="20" r="6" />
      <circle cx="24" cy="14" r="6" />
      <circle cx="36" cy="20" r="6" />
      <circle cx="8" cy="30" r="5" />
      <circle cx="40" cy="30" r="5" />
    </svg>
  );
}

export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-logo ${compact ? 'brand-logo--compact' : ''}`}>
      <PawIcon className="brand-logo__icon" />
      <div className="brand-logo__text">
        <span className="brand-logo__title">VetCare</span>
        <span className="brand-logo__subtitle">Clinic Management</span>
      </div>
    </div>
  );
}
