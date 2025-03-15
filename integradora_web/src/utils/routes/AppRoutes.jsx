import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useUserContext } from '../../contexts/UserProvider';

// Styles
import '../../styles/preloader.css';
import '../../styles/sweetAlert.css';

// Bootstrap
import '../../styles/bootstrap/bootstrap-icons.min.css';
import '../../styles/bootstrap/bootstrap.min.css'

// Pages
import Login from '../../pages/Login';
import DashboardAdmin from '../../pages/DashboardAdmin';
import Users from '../../pages/Users';

const AppRoutes = () => {
  const { user } = useUserContext();

  return (
    <Routes>

      <Route element={<ProtectedRoute isAllowed={true /* !!user && user.role.includes('ADMIN') */} redirectTo="/login" />} >
        <Route path="/admin/dashboard/" element={<DashboardAdmin />} />
        <Route path="/admin/users/" element={<Users />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/" index element={<Login />} />

      {/* <Route path="/user/dashboard" element={
              <ProtectedRoute >
                <UserDashboard />
              </ProtectedRoute>
            } /> */}

    </Routes>
  )
};

export default AppRoutes;