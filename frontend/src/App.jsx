import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import GuestRoute from './components/GuestRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AddOwnerPage from './pages/AddOwnerPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PetsPage from './pages/PetsPage.jsx';
import VeterinariansPage from './pages/VeterinariansPage.jsx';

function AddOwnerRoute() {
  const location = useLocation();
  const pageKey = location.state?.reset ?? 'default';

  return (
    <ProtectedRoute>
      <AddOwnerPage key={pageKey} />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/owners/new" element={<AddOwnerRoute />} />
        <Route
          path="/pets"
          element={
            <ProtectedRoute>
              <PetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/veterinarians"
          element={
            <ProtectedRoute>
              <VeterinariansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
