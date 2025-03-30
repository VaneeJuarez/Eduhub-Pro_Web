// App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

// Contextos
import { UserProvider } from './contexts/UserProvider';

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider >
  )
};

export default App;
