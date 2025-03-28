import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useUserContext } from '../../contexts/UserProvider';

// Bootstrap
import '../../styles/bootstrap/bootstrap-icons.min.css';
import '../../styles/bootstrap/bootstrap.min.css'

// Pages
import Login from '../../pages/Login';
import DashboardAdmin from '../../pages/DashboardAdmin';
import Users from '../../pages/Users';
import Courses from '../../pages/Courses';
import CourseDetail from '../../pages/CourseDetail';
import MyCourses from '../../pages/instructor/MyCourses';
import CourseDetailPage from '../../pages/instructor/CourseDetailPage';
import BankAccounts from '../../pages/BankAccounts';
import Dashboard from '../../pages/instructor/Dashboard';

const AppRoutes = () => {
  const { user } = useUserContext();

  return (
    <Routes>
      <Route element={<ProtectedRoute isAllowed={!!user && user.role.includes('ADMIN')} redirectTo="/login" />} >
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/courses/:id" element={<CourseDetail />} />
        <Route path="/admin/accounts" element={<BankAccounts />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={!!user && user.role.includes('INSTRUCTOR')} redirectTo="/login" />} >
        <Route path="/inst/dashboard" element={<Dashboard />} />
        <Route path="/inst/courses" element={<MyCourses />} />
        <Route path="/inst/courses/:id" element={<CourseDetailPage />} />
      </Route>

      <Route path='/login' index element={<Login />} />
      <Route path='/' element={<Login />} />

      {/* <Route path="/user/dashboard" element={
              <ProtectedRoute >
                <UserDashboard />
              </ProtectedRoute>
            } /> */}

    </Routes>
  )
};

export default AppRoutes;