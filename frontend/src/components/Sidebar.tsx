interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onSair: () => void;
  isAdm: boolean;
}

export default function Sidebar({ abaAtiva, setAbaAtiva, onSair, isAdm }: SidebarProps) {
  const menus = [
    { id: 'painel', nome: 'Painel Geral' },
    { id: 'unidades', nome: 'Moradores' },
    { id: 'portaria', nome: 'Portaria' },
    { id: 'reservas', nome: 'Reservas' },
    { id: 'financeiro', nome: 'Financeiro' },
  ];

  const menusAdm = [
    { id: 'estrutura', nome: 'Blocos e Apartamentos' },
    { id: 'espacos-reserva', nome: 'Espaços para Reserva' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-8">
        <div className="px-2 py-4">
          <h1 className="text-xl font-black text-white tracking-tight">Portal do Morador</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isAdm ? 'Acesso Administrativo' : 'Acesso do Morador'}
          </p>
        </div>

        <nav className="space-y-1">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setAbaAtiva(menu.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                abaAtiva === menu.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {menu.nome}
            </button>
          ))}

          {isAdm && (
            <div className="pt-2 space-y-1">
              {menusAdm.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setAbaAtiva(menu.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all border border-dashed ${
                    abaAtiva === menu.id
                      ? 'bg-blue-950/40 text-blue-400 border-blue-800/60'
                      : 'border-slate-800/60 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {menu.nome}
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>

      <div className="space-y-2 border-t border-slate-800 pt-4">
        <button className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors">
          Suporte
        </button>
        <button
          onClick={onSair}
          className="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
