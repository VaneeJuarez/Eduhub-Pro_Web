import { Route, Routes } from 'react-router-dom';
import { useUserContext } from '../../contexts/UserProvider';
import ProtectedRoute from './ProtectedRoute';

// Styles
import '../../styles/preloader.css';

// Bootstrap
import '../../styles/bootstrap/bootstrap-icons.min.css';
import '../../styles/bootstrap/bootstrap.min.css';

// Pages
import CourseDetail from '../../pages/CourseDetail';
import Courses from '../../pages/Courses';
import DashboardAdmin from '../../pages/DashboardAdmin';
import Login from '../../pages/Login';
import Users from '../../pages/Users';

const AppRoutes = () => {
  const { user } = useUserContext();

  return (
    <Routes>

      <Route index element={<Login />} path='/login' />
      <Route element={<Login />} path='/' />

      <Route element={<ProtectedRoute isAllowed={!!user && user.role.includes('ADMIN')} redirectTo="/login" />} >
        <Route path="/admin/dashboard/" element={<DashboardAdmin />} />
        <Route path="/admin/users/" element={<Users />} />
        <Route path="/admin/courses/" element={<Courses />} />
        <Route path="/admin/course/:id" element={<CourseDetail />} />
      </Route>

      {/* <Route path="/user/dashboard" element={
              <ProtectedRoute >
                <UserDashboard />
              </ProtectedRoute>
            } /> */}

    </Routes>
  )
};

export default AppRoutes;