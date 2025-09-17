import React from 'react';

function Navbar({ view, setView }) {
  return (
    <nav
      className="w-full bg-[linear-gradient(to_right,#7f0000,#b30000,#000,#000)] border-b border-red-900/60 shadow-lg sticky top-0 z-50"
      style={{ background: 'linear-gradient(to right,#7f0000,#b30000,#000000)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h2 className="text-white text-xl font-bold">Inquisitorio</h2>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setView('usuarios')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                view === 'usuarios'
                  ? 'bg-white text-red-700 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setView('items')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                view === 'items'
                  ? 'bg-white text-red-700 shadow-md'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              Items
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
