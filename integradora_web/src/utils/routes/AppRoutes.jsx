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
import Payments from '../../pages/Payments';
import Profile from '../../pages/instructor/Profile';
import ProfilePhoto from '../../pages/instructor/ProfilePhoto'
import ToastExample from '../../pages/ToastExample';
const AppRoutes = () => {
  const { user } = useUserContext();

  return (
    <Routes>

      <Route element={<ProtectedRoute isAllowed={true /* !!user && user.role.includes('ADMIN') */} redirectTo="/login" />} >
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/courses" element={<Courses />} />
        <Route path="/admin/courses/:id" element={<CourseDetail />} />
        <Route path="/admin/accounts" element={<BankAccounts/>} />
        <Route path="/admin/payments" element={<Payments />} />

        <Route path="/inst/dashboard" element={<Dashboard />} /> 
        <Route path="/inst/courses" element={<MyCourses />} />
        <Route path="/inst/courses/:id" element={<CourseDetailPage />} />
        <Route path='/inst/profile' element={<Profile />} />
        <Route path='/inst/profile/photo' element={<ProfilePhoto />} />

        <Route path='/toast' element={<ToastExample />} />
      </Route>

    

      <Route index element={<Login />} />

      {/* <Route path="/user/dashboard" element={
              <ProtectedRoute >
                <UserDashboard />
              </ProtectedRoute>
            } /> */}

    </Routes>
  )
};

export default AppRoutes;