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
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  idade: number;
  bloco: string | Bloco;
  apartamento: string | Apartamento;
  tipo: string;
}

interface ListaMoradoresProps {
  onAdicionarMorador: () => void;
  onEditarMorador: (morador: Morador) => void;
}

export default function ListaMoradores({ onAdicionarMorador, onEditarMorador }: ListaMoradoresProps) {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);

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
      console.error(err);
      setErro('Não foi possível carregar os moradores do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarMoradores();
  }, []);

  const handleDeletarMorador = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o morador ${nome}?`)) return;
    try {
      await api.delete(`/moradores/${id}`);
      setMenuAbertoId(null);
      buscarMoradores();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(mensagem || 'Erro ao tentar remover o morador do banco de dados.');
    }
  };

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
          <p className="text-sm text-slate-500">Visualize moradores registrados e suas unidades atribuídas.</p>
        </div>
        <button
          onClick={onAdicionarMorador}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-colors"
        >
          <span>+</span> Adicionar Morador
        </button>
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
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Buscando...</td>
                </tr>
              ) : moradores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Nenhum morador cadastrado.</td>
                </tr>
              ) : (
                moradores.map((morador) => (
                  <tr key={morador.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {typeof morador.apartamento === 'object' && morador.apartamento?.bloco
                        ? morador.apartamento.bloco.nome
                        : '-'}
                    </td>
                    <td className="py-4 px-6">
                      {typeof morador.apartamento === 'object' && morador.apartamento !== null ? (morador.apartamento as Apartamento).numero : (morador.apartamento as string) || '-'}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">{morador.nome}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Inquilino</span>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <button onClick={() => setMenuAbertoId(menuAbertoId === morador.id ? null : morador.id)} className="text-slate-400 hover:text-slate-600 font-bold px-2">•••</button>
                      {menuAbertoId === morador.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuAbertoId(null)}></div>
                          <div className="absolute right-6 top-12 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-20 text-left">
                            <button onClick={() => { setMenuAbertoId(null); onEditarMorador(morador); }} className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2">✏️ Editar</button>
                            <button onClick={() => handleDeletarMorador(morador.id, morador.nome)} className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50">🗑️ Apagar</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}