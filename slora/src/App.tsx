import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
// import AuthRoute from './components/AuthRoute'; // TODO: Create AuthRoute component

// Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/App.css';

// Lazy-loaded pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Room = lazy(() => import('./pages/Room'));
const CreateRoom = lazy(() => import('./pages/CreateRoom'));

// Custom Routes component to conditionally render navigation and footer
const AppRoutes = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';

  // Don't show navigation on the Landing and Dashboard pages
  const hideNavigation = isLandingPage || isDashboardPage;

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {!hideNavigation && <Navigation />}
      
      <main className="flex-grow-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth routes - redirect to dashboard if already logged in */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/room/:roomId" element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            } />
            
            <Route path="/create-room" element={
              <ProtectedRoute>
                <CreateRoom />
              </ProtectedRoute>
            } />
            
            {/* 404 page */}
            <Route path="/404" element={<NotFound />} />
            
            {/* Redirect any unmatched routes to 404 */}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Suspense>
      </main>
      
      {!isLandingPage && !isDashboardPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
