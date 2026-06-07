import React from 'react';

export default function Sidebar() {
  const menuItems = [
    { label: 'Painel Geral', active: false },
    { label: 'Unidades', active: true },
    { label: 'Portaria', active: false },
    { label: 'Reservas', active: false },
    { label: 'Financeiro', active: false },
  ];

  return (
    <div className="w-64 bg-[#1e2538] text-slate-400 flex flex-col justify-between p-4 min-h-screen">
      <div>
        <div className="mb-10 px-2 pt-4">
          <h1 className="text-xl font-bold text-white tracking-wide">Portal do Morador</h1>
          <p className="text-xs text-slate-500">Acesso Administrador</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-[#2b344d] text-white'
                  : 'hover:bg-[#252d44] hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-1 border-t border-slate-700/50 pt-4">
        <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#252d44] hover:text-slate-200">
          Suporte
        </button>
        <button className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-rose-950/30 hover:text-rose-400">
          Sair
        </button>
      </div>
    </div>
  );
}