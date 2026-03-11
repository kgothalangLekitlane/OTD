import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const LicenseLookup = lazy(() => import('./pages/LicenseLookup'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Fines = lazy(() => import('./pages/Fines'));
const Login = lazy(() => import('./pages/Login'));
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'));
const MyLicense = lazy(() => import('./pages/driver/MyLicense'));
const MyFines = lazy(() => import('./pages/driver/MyFines'));
const BookAppointment = lazy(() => import('./pages/driver/BookAppointment'));
const OfficerDashboard = lazy(() => import('./pages/officer/OfficerDashboard'));
const OfficerLookup = lazy(() => import('./pages/officer/LicenseLookup'));
const IssueFine = lazy(() => import('./pages/officer/IssueFine'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/license-lookup" element={<LicenseLookup />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/fines" element={<Fines />} />

      <Route path="/driver" element={<ProtectedRoute roles={['driver']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/driver/license" element={<ProtectedRoute roles={['driver']}><MyLicense /></ProtectedRoute>} />
      <Route path="/driver/fines" element={<ProtectedRoute roles={['driver']}><MyFines /></ProtectedRoute>} />
      <Route path="/driver/appointments" element={<ProtectedRoute roles={['driver']}><BookAppointment /></ProtectedRoute>} />

      <Route path="/officer" element={<ProtectedRoute roles={['officer', 'admin']}><OfficerDashboard /></ProtectedRoute>} />
      <Route path="/officer/lookup" element={<ProtectedRoute roles={['officer', 'admin']}><OfficerLookup /></ProtectedRoute>} />
      <Route path="/officer/issue-fine" element={<ProtectedRoute roles={['officer', 'admin']}><IssueFine /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
