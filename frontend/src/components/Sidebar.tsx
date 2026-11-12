import React from 'react';

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onSair: () => void;
  isAdm: boolean;
}

export default function Sidebar({ abaAtiva, setAbaAtiva, onSair, isAdm }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-8">
        <div className="px-2 py-4">
          <h1 className="text-xl font-black text-white tracking-tight">Portal do Morador</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isAdm ? 'Acesso Administrativo' : 'Acesso Residente'}
          </p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setAbaAtiva('painel')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              abaAtiva === 'painel' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            Painel Geral
          </button>

          <button
            onClick={() => setAbaAtiva('unidades')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              abaAtiva === 'unidades' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            Moradores
          </button>

          <button
            onClick={() => setAbaAtiva('portaria')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              abaAtiva === 'portaria' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            Portaria
          </button>

          <button
            onClick={() => setAbaAtiva('reservas')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              abaAtiva === 'reservas' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            Reservas
          </button>

          <button
            onClick={() => setAbaAtiva('financeiro')}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              abaAtiva === 'financeiro' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            Financeiro
          </button>

          {/* MENUS ESTRUTURAIS EXCLUSIVOS PARA O ADMINISTRADOR */}
          {isAdm && (
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
              <span className="block px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Configurações ADM
              </span>
              
              <button
                onClick={() => setAbaAtiva('estrutura')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  abaAtiva === 'estrutura' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                Blocos e Apartamentos
              </button>

              <button
                onClick={() => setAbaAtiva('espacos-reserva')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  abaAtiva === 'espacos-reserva' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                Espaços para Reserva
              </button>

              <button
                onClick={() => setAbaAtiva('registrar-encomenda')}
                className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  abaAtiva === 'registrar-encomenda' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 'hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                Registrar Encomenda
              </button>
            </div>
          )}
        </nav>
      </div>

      <div className="space-y-2 border-t border-slate-800 pt-4">
        <button className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">
          Suporte
        </button>
        <button
          onClick={onSair}
          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}