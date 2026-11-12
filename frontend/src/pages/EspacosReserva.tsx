import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface AreaComum {
  id: number;
  nome: string;
}

export default function EspacosReserva() {
  const [areas, setAreas] = useState<AreaComum[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [nome, setNome] = useState('');
  const [areaEmEdicao, setAreaEmEdicao] = useState<AreaComum | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  async function carregarAreas() {
    try {
      setLoadingList(true);
      const response = await api.get('/areas-comuns');
      setAreas(Array.isArray(response.data) ? response.data : response.data?.content ?? []);
    } catch (error) {
      console.error('Erro ao carregar espacos:', error);
      setMensagem({ tipo: 'erro', texto: 'Nao foi possivel carregar os espacos.' });
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    carregarAreas();
  }, []);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      if (areaEmEdicao) {
        await api.put(`/areas-comuns/${areaEmEdicao.id}`, { nome });
        setMensagem({ tipo: 'sucesso', texto: 'Espaco atualizado com sucesso.' });
        setAreaEmEdicao(null);
      } else {
        await api.post('/areas-comuns', { nome });
        setMensagem({ tipo: 'sucesso', texto: 'Espaco cadastrado com sucesso.' });
      }
      setNome('');
      carregarAreas();
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar o espaco.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id: number, nomeArea: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nomeArea}"?`)) return;

    try {
      await api.delete(`/areas-comuns/${id}`);
      setMensagem({ tipo: 'sucesso', texto: 'Espaco removido com sucesso.' });
      carregarAreas();
    } catch (error) {
      console.error(error);
      setMensagem({
        tipo: 'erro',
        texto: 'Erro ao excluir espaco. Verifique se existem reservas vinculadas.',
      });
    }
  };

  const handleIniciarEdicao = (area: AreaComum) => {
    setAreaEmEdicao(area);
    setNome(area.nome);
    setMensagem({ tipo: '', texto: '' });
  };

  const handleCancelarEdicao = () => {
    setAreaEmEdicao(null);
    setNome('');
    setMensagem({ tipo: '', texto: '' });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Espaços para Reserva</h2>
        <p className="text-sm text-slate-500">
          Cadastre os locais do condomínio disponíveis para agendamento, como piscina, salão de festas e churrasqueira.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <form onSubmit={handleSalvar} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              {areaEmEdicao ? 'Editar Espaco' : 'Novo Espaco'}
            </h3>

            {mensagem.texto && (
              <div
                className={`p-3 text-xs font-medium rounded-xl text-center ${
                  mensagem.tipo === 'sucesso'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {mensagem.texto}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Espaco</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Piscina, Salao de Festas"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-2">
              {areaEmEdicao && (
                <button
                  type="button"
                  onClick={handleCancelarEdicao}
                  className="w-1/2 py-2 border text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`py-2 text-sm font-semibold text-white rounded-xl disabled:bg-slate-400 ${
                  areaEmEdicao ? 'w-1/2 bg-blue-600 hover:bg-blue-700' : 'w-full bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {loading ? 'Salvando...' : areaEmEdicao ? 'Atualizar' : 'Cadastrar Espaco'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Espacos Cadastrados</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <tr>
                  <th className="p-3 pl-4 text-center w-20">ID</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3 text-right pr-4">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList && areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-xs text-slate-400">
                      Carregando...
                    </td>
                  </tr>
                ) : areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-xs text-slate-400">
                      Nenhum espaco cadastrado.
                    </td>
                  </tr>
                ) : (
                  areas.map((area) => (
                    <tr key={area.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-600 bg-blue-50/20 text-center">
                        {area.id}
                      </td>
                      <td className="p-3 font-medium text-slate-800">{area.nome}</td>
                      <td className="p-3 text-right pr-4 space-x-3 text-slate-400">
                        <button
                          type="button"
                          className="text-xs font-semibold hover:text-blue-600"
                          onClick={() => handleIniciarEdicao(area)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="text-xs font-semibold hover:text-rose-600"
                          onClick={() => handleDeletar(area.id, area.nome)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
