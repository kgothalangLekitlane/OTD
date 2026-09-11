import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard'));
const LicenseLookup = lazy(() => import('./pages/LicenseLookup'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Fines = lazy(() => import('./pages/Fines'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Suspense fallback={<div className="page-loading" role="status">Loading OTD…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute roles={["officer", "admin"]}><OfficerDashboard /></ProtectedRoute>} />
            <Route path="/license-lookup" element={<LicenseLookup />} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/fines" element={<ProtectedRoute><Fines /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
