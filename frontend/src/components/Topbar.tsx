import React from 'react';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 w-full">
      <div className="text-xl font-bold text-slate-800">
        CondoManager
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar moradores ou unidades..."
            className="w-72 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            🔔
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            ⚙️
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="Perfil do usuário" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}