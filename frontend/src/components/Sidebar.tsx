import React from 'react';

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onSair: () => void;
}

export default function Sidebar({ abaAtiva, setAbaAtiva, onSair }: SidebarProps) {
  // Simulando a role diretamente para visualização (no futuro você pode decodificar o JWT)
  // Por padrão, deixamos visível se for ADM
  const isAdm = true; 

  const menus = [
    { id: 'painel', nome: 'Painel Geral', icone: '📊' },
    { id: 'unidades', nome: 'Unidades', icone: '🏢' },
    { id: 'portaria', nome: 'Portaria', icone: '📦' },
    { id: 'reservas', nome: 'Reservas', icone: '📅' },
    { id: 'financeiro', nome: 'Financeiro', icone: '💰' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-8">
        <div className="px-2 py-4">
          <h1 className="text-xl font-black text-white tracking-tight">Portal do Morador</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Acesso Administrativo</p>
        </div>

        <nav className="space-y-1">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setAbaAtiva(menu.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                abaAtiva === menu.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{menu.icone}</span>
              {menu.nome}
            </button>
          ))}

          {/* ABA EXCLUSIVA DO ADM */}
          {isAdm && (
            <button
              onClick={() => setAbaAtiva('estrutura')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all border border-dashed ${
                abaAtiva === 'estrutura'
                  ? 'bg-blue-950/40 text-blue-400 border-blue-800/60'
                  : 'border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="text-base">⚙️</span>
              Estrutura (ADM)
            </button>
          )}
        </nav>
      </div>

      <div className="space-y-2 border-t border-slate-800 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">
          🛠️ Suporte
        </button>
        <button
          onClick={onSair}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors"
        >
          🚪 Sair
        </button>
      </div>
    </div>
  );
}