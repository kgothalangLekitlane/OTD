import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// Lazy-load page components to reduce initial bundle size
const Home = lazy(() => import('./pages/Home'));
const LicenseLookup = lazy(() => import('./pages/LicenseLookup'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Fines = lazy(() => import('./pages/Fines'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/license-lookup" element={<LicenseLookup />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/fines" element={<Fines />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
