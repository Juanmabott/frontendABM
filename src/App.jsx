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
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Sistema de Gestión ABM
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-700 mt-6 max-w-2xl mx-auto leading-relaxed">
            Administra usuarios e items de manera eficiente con nuestra plataforma moderna e intuitiva
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Gestión de</p>
                <p className="text-2xl font-bold">Usuarios</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Gestión de</p>
                <p className="text-2xl font-bold">Items</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 flex">
          {/* Flex wrapper for ABM content */}
          <div className="relative flex w-full">
            <div className="relative z-10 w-full p-4 sm:p-5 md:p-6 rounded-2xl bg-white/40">
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
