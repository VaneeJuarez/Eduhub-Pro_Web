import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useUserContext } from '../contexts/UserProvider';

// Bootstrap
import '../styles/bootstrap/bootstrap-icons.min.css';
import '../styles/bootstrap/bootstrap.min.css'

// Pages
import Login from '../pages/global/Login';
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import Users from '../pages/admin/Users';
import Courses from '../pages/admin/Courses';
import CourseDetail from '../pages/admin/CourseDetail';
import MyCourses from '../pages/instructor/MyCourses';
import CourseDetailPage from '../pages/instructor/CourseDetailPage';
import BankAccounts from '../pages/admin/BankAccounts';
import Payments from '../pages/admin/Payments';
import Profile from '../pages/instructor/Profile';
import ProfilePhoto from '../pages/instructor/ProfilePhoto'
import TechnicalSupport from '../pages/instructor/TechnicalSupport';
import RecoverPassword from '../pages/global/RecoverPassword';

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
        <Route path="/admin/payments" element={<Payments />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={!!user && user.role.includes('INSTRUCTOR')} redirectTo="/login" />} >
        <Route path="/inst/courses" element={<MyCourses />} />
        <Route path="/inst/courses/:id" element={<CourseDetailPage />} />
        <Route path='/inst/profile' element={<Profile />} />
        <Route path='/inst/profile/photo' element={<ProfilePhoto />} />
        <Route path='/inst/support' element={<TechnicalSupport />} />
      </Route>

      <Route path='/login' index element={<Login />} />
      <Route path='/' element={<Login />} />
      <Route path='/forgot-password' element={<RecoverPassword />} />

      {/* <Route path="/user/dashboard" element={
              <ProtectedRoute >
                <UserDashboard />
              </ProtectedRoute>
            } /> */}

    </Routes>
  )
};

export default AppRoutes;