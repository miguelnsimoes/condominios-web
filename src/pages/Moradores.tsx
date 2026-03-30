import { Search, Plus, UserCircle, Edit, Trash2 } from 'lucide-react';

const moradoresMock = [
  { id: 1, nome: "Miguel Simões", cpf: "123.456.789-00", apto: "101", bloco: "A" },
  { id: 2, nome: "Joao Levi", cpf: "987.654.321-11", apto: "202", bloco: "B" },
  { id: 3, nome: "Joao Lorenzetti", cpf: "456.789.123-22", apto: "303", bloco: "A" },
];

export function Moradores() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Moradores</h1>
          <p className="text-slate-500">Visualize e gerencie os residentes do condomínio.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition">
          <Plus size={20} /> Novo Morador
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nome ou CPF..." 
          className="w-full outline-none text-slate-700"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-slate-400 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4">Morador</th>
              <th className="px-6 py-4">CPF</th>
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {moradoresMock.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {m.nome.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-700">{m.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{m.cpf}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  Bloco {m.bloco} - Ap {m.apto}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}