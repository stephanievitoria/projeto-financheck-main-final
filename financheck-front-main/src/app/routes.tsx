import { createBrowserRouter } from 'react-router';
import { Navigate, Outlet } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SelectProfile } from './pages/SelectProfile';
import { Root } from './Root';
import { useAuth } from './context/AuthContext';

function ProtectedRoute() {
  const { user, selectedProfile } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!selectedProfile) return <Navigate to="/selecionar-perfil" replace />;

  return <Outlet />;
}

function ProfileSelectionRoute() {
  const { user, selectedProfile } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (selectedProfile) return <Navigate to="/" replace />;

  return <SelectProfile />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/cadastro',
    Component: Register,
  },
  {
    path: '/selecionar-perfil',
    Component: ProfileSelectionRoute,
  },
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        Component: Root,
        children: [
          { index: true, Component: Dashboard },
          { path: 'metas', Component: Goals },
          { path: 'perfil', Component: Profile },
          { path: 'perfil/editar', Component: EditProfile },
        ],
      },
    ],
  },
]);
