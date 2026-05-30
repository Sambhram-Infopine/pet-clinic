# Frontend

The frontend is a React application built with Vite. It provides the user interface for VetCare, including login, navigation, and protected routes for authenticated users.

## Project Structure

- `src/App.jsx` — main application shell and route configuration
- `src/main.jsx` — app entry point
- `src/pages/` — page components such as `LoginPage`, `HomePage`, `PetsPage`, and `AddOwnerPage`
- `src/components/` — reusable UI elements like `ProtectedRoute`, `GuestRoute`, `AppNavbar`, and branding components
- `src/constants/` — authentication helpers and workflow state
- `src/__tests__/` — frontend unit tests for page and route behavior

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — build production assets
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run format` — format files with Prettier
- `npm test` — run frontend tests with Vitest

## Testing

The frontend uses Vitest and Testing Library for component-level tests.

```powershell
cd frontend
npm install
npm test
```

## Notes

- Login state is stored in `sessionStorage` using `access_token`.
- `ProtectedRoute` and `GuestRoute` enforce authentication flow.
- Update API paths in `LoginPage.jsx` if backend endpoints change.
