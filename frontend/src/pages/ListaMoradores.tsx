import React from 'react';

interface ListaMoradoresProps {
  onAdicionarMorador: () => void;
}

export default function ListaMoradores({ onAdicionarMorador }: ListaMoradoresProps) {
  const moradoresExemplo = [
    { bloco: 'A', apartamento: '102', nome: 'Marco Beltrão', tipo: 'Proprietário', iniciais: 'MB' },
    { bloco: 'B', apartamento: '405', nome: 'Lúcia Silva', tipo: 'Inquilino', iniciais: 'LS' },
    { bloco: 'A', apartamento: '310', nome: 'Ricardo Pereira', tipo: 'Proprietário', iniciais: 'RP' },
    { bloco: 'C', apartamento: '012', nome: 'Ana Maria', tipo: 'Inquilino', iniciais: 'AM' },
    { bloco: 'B', apartamento: '202', nome: 'João Santos', tipo: 'Proprietário', iniciais: 'JS' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Diretório de Moradores</h2>
          <p className="text-sm text-slate-500">Gerencie e visualize todos os moradores registrados e suas unidades atribuídas.</p>
        </div>
        <button
          onClick={onAdicionarMorador}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
        >
          <span>+</span> Adicionar Morador
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                <th className="py-4 px-6">Bloco</th>
                <th className="py-4 px-6">Unidade</th>
                <th className="py-4 px-6">Nome do Morador</th>
                <th className="py-4 px-6">Tipo</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {moradoresExemplo.map((morador, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-800">{morador.bloco}</td>
                  <td className="py-4 px-6">{morador.apartamento}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                        {morador.iniciais}
                      </div>
                      <span className="font-medium text-slate-900">{morador.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      morador.tipo === 'Proprietário' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {morador.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-400 hover:text-slate-600 cursor-pointer font-bold">
                    •••
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>Exibindo 5 de 124 moradores</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">‹</button>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">›</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-xl">👥</div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ocupação Total</p>
            <p className="text-2xl font-bold text-slate-800">94%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-xl">📋</div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cadastros Pendentes</p>
            <p className="text-2xl font-bold text-slate-800">08</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-xl">🔑</div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unidades Disponíveis</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </div>
        </div>
      </div>
    </div>
  );
}