import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Licensing = lazy(() => import('./pages/Licensing'));
const LicenseLookup = lazy(() => import('./pages/LicenseLookup'));
const OfficerDashboard = lazy(() => import('./pages/OfficerDashboard'));
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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/licensing" element={<Licensing />} />
                <Route path="/licensing/my-licence" element={<LicenseLookup />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/fines" element={<Fines />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute roles={["officer", "admin"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/operations" element={<OfficerDashboard />} />
                <Route path="/licensing/lookup" element={<LicenseLookup />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
