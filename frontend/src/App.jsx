import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LicenseLookup from './pages/LicenseLookup';
import Appointments from './pages/Appointments';
import Fines from './pages/Fines';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/license-lookup" element={<LicenseLookup />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/fines" element={<Fines />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
