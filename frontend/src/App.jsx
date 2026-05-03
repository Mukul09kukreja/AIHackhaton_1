import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [entered, setEntered] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Toaster />
      <Navbar />
      {entered ? <Dashboard /> : <LandingPage onEnter={() => setEntered(true)} />}
    </div>
  );
}
