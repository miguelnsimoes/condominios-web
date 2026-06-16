import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Bloco {
  id: number;
  nome: string;
}

interface Apartamento {
  id: number;
  numero: string;
  bloco?: Bloco;
}

interface Morador {
  id?: number;
  nome: string;
  bloco: string | Bloco;
  apartamento: string | Apartamento;
  tipo: string;
}

interface ListaMoradoresProps {
  onAdicionarMorador: () => void;
  onGerenciarEstrutura: () => void;
}

export default function ListaMoradores({ onAdicionarMorador, onGerenciarEstrutura }: ListaMoradoresProps) {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarMoradores() {
      try {
        setLoading(true);
        setErro('');
        const response = await api.get('/moradores');
        
        if (response.data && Array.isArray(response.data)) {
          setMoradores(response.data);
        } else if (response.data && Array.isArray(response.data.content)) {
          setMoradores(response.data.content);
        } else {
          setMoradores([]);
        }
      } catch (err: any) {
        console.error("Erro na requisição de moradores:", err);
        setErro('Não foi possível carregar os moradores do servidor.');
      } finally {
        setLoading(false);
      }
    }

    buscarMoradores();
  }, []);

  const getIniciais = (nome: string) => {
    if (!nome) return 'M';
    return nome
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'M';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Diretório de Moradores</h2>
          <p className="text-sm text-slate-500">Gerencie e visualize todos os moradores registrados e suas unidades atribuídas.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onGerenciarEstrutura}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            ⚙️ Estrutura (ADM)
          </button>
          <button
            onClick={onAdicionarMorador}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
          >
            <span>+</span> Adicionar Morador
          </button>
        </div>
      </div>

      {erro && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 text-center border border-rose-100">
          {erro}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Buscando moradores no banco de dados...
                  </td>
                </tr>
              ) : moradores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    Nenhum morador cadastrado no sistema ainda.
                  </td>
                </tr>
              ) : (
                moradores.map((morador, index) => (
                  <tr key={morador.id || index} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {typeof morador.bloco === 'object' && morador.bloco !== null
                        ? (morador.bloco as Bloco).nome || '-'
                        : (morador.bloco as string) || '-'}
                    </td>

                    <td className="py-4 px-6">
                      {typeof morador.apartamento === 'object' && morador.apartamento !== null
                        ? (morador.apartamento as Apartamento).numero || '-'
                        : (morador.apartamento as string) || '-'}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                          {getIniciais(morador.nome)}
                        </div>
                        <span className="font-medium text-slate-900">{morador.nome || 'Sem Nome'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        morador.tipo === 'Proprietario' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {morador.tipo === 'Proprietario' ? 'Proprietário' : 'Inquilino'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-slate-400 hover:text-slate-600 cursor-pointer font-bold">
                      •••
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
          <span>Exibindo {moradores.length} moradores</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">‹</button>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold">1</button>
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
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total de Cadastros</p>
            <p className="text-2xl font-bold text-slate-800">{moradores.length}</p>
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