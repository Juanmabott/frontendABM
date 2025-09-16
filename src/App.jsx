import './index.css'; // importa tailwind
import { useState, useEffect } from 'react';
import UsuariosABM from './UsuariosABM';
import ItemsABM from './ItemsABM';
import Navbar from './Navbar';

function App() {
  const [view, setView] = useState('usuarios');

  useEffect(() => {
    fetch("https://abm-express.onrender.com/healthz")
      .then(() => console.log("Backend activado"))
      .catch(err => console.error("Error al activar backend", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar view={view} setView={setView} />
      
  <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-12 py-8 flex-1 flex flex-col">
        {/* Header Section */}
        

        {/* Stats Cards */}
        

        {/* Main Content Area */}
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 lg:p-12 flex w-full">
          {/* Flex wrapper for ABM content */}
          <div className="relative flex w-full">
            <div className="relative z-10 w-full p-8 sm:p-7 md:p-8 rounded-2xl bg-white/40">
              {view === 'usuarios' ? <UsuariosABM /> : <ItemsABM />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-6">
          <p className="text-gray-500 text-sm">
            © 2025 ABM Express - Sistema de gestión moderno y eficiente
          </p>
        </div>
      </main>
    </div>
  );
}


export default App
