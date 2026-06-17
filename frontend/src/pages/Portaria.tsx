import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUserRole } from '../services/auth';

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
  apartamento?: Apartamento;
}

interface Encomenda {
  id: number;
  descricao: string;
  chegada: string;
  dataRetirada: string | null;
  status: 'PENDENTE' | 'RETIRADA';
  apartamento: Apartamento;
}

interface PortariaProps {
  mode: 'admin' | 'view';
}

function formatarData(dataIso: string) {
  if (!dataIso) return '-';
  try {
    const [ano, mes, dia] = dataIso.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return dataIso;
  }
}

export default function Portaria({ mode }: PortariaProps) {
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Estados do formulário
  const [descricao, setDescricao] = useState('');
  const [moradorId, setMoradorId] = useState('');

  async function carregarDados() {
    try {
      setLoading(true);
      setErro('');

      let urlEncomendas = '/encomendas';
      
      // Se for modo de visualização (Morador), aplicamos o filtro da query string
      if (mode === 'view') {
        // Tenta buscar o apartamentoId salvo no localStorage durante o login
        const moradorAptoId = localStorage.getItem('@CondoManager:apartamentoId');
        if (moradorAptoId) {
          urlEncomendas = `/encomendas?apartamentoId=${moradorAptoId}`;
        }
      }

      const [resEncomendas, resMoradores] = await Promise.all([
        api.get(urlEncomendas),
        mode === 'admin' ? api.get('/moradores') : Promise.resolve({ data: [] })
      ]);

      setEncomendas(Array.isArray(resEncomendas.data) ? resEncomendas.data : resEncomendas.data?.content ?? []);
      if (mode === 'admin') {
        setMoradores(Array.isArray(resMoradores.data) ? resMoradores.data : resMoradores.data?.content ?? []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados da portaria:", err);
      setErro('Não foi possível carregar as informações da portaria.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [mode]);

  const handleRegistrarEncomenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !moradorId) {
      setErro('Preencha a descrição e selecione o destinatário.');
      return;
    }

    const moradorSelecionado = moradores.find(m => m.id === Number(moradorId));
    if (!moradorSelecionado || !moradorSelecionado.apartamento?.id) {
      setErro('O morador selecionado não possui um apartamento vinculado.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso('');

    const payload = {
      descricao,
      status: 'PENDENTE',
      apartamento: { id: moradorSelecionado.apartamento.id }
    };

    try {
      await api.post('/encomendas', payload);
      setSucesso('Encomenda registrada com sucesso! 📦');
      setDescricao('');
      setMoradorId('');
      carregarDados();
    } catch (err: any) {
      setErro(err.response?.data?.message || 'Erro ao registrar encomenda no servidor.');
    } finally {
      setSalvando(false);
    }
  };

  const handleMarcarComoRetirado = async (id: number) => {
    try {
      setErro('');
      await api.put(`/encomendas/${id}/retirada`);
      setSucesso('Encomenda marcada como retirada.');
      carregarDados();
    } catch (err) {
      setErro('Não foi possível registrar a retirada da encomenda.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'admin' ? 'Painel de Registro de Encomendas' : 'Minhas Encomendas'}
        </h2>
        <p className="text-sm text-slate-500">
          {mode === 'admin' 
            ? 'Controle de recebimento de volumes externos destinados às unidades habitacionais.' 
            : 'Histórico e status de pacotes entregues na portaria para o seu apartamento.'}
        </p>
      </div>

      {erro && (
        <div className="p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 text-center border border-rose-100">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 text-center border border-emerald-100">
          {sucesso}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TABELA DE ENCOMENDAS (APARECE EM AMBOS OS MODOS, MAS AJUSTA O CONTEÚDO) */}
        <div className={`${mode === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden h-fit`}>
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">
              {mode === 'admin' ? 'Pacotes Aguardando Coleta' : 'Volumes do seu Apartamento'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-4 px-6">Apartamento / Bloco</th>
                  <th className="py-4 px-6">Descrição do Volume</th>
                  <th className="py-4 px-6">Data de Chegada</th>
                  <th className="py-4 px-6">Status</th>
                  {mode === 'admin' && <th className="py-4 px-6 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Buscando registros...</td></tr>
                ) : encomendas.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Nenhuma encomenda encontrada.</td></tr>
                ) : (
                  encomendas.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">Apto {item.apartamento?.numero ?? '-'}</span>
                          <span className="text-xs text-slate-400">{item.apartamento?.bloco?.nome ? `Bloco ${item.apartamento.bloco.nome}` : 'Geral'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">{item.descricao}</td>
                      <td className="py-4 px-6 text-slate-500">{formatarData(item.chegada)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'PENDENTE' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {item.status === 'PENDENTE' ? 'Pendente' : 'Retirada'}
                        </span>
                      </td>
                      {mode === 'admin' && (
                        <td className="py-4 px-6 text-right">
                          {item.status === 'PENDENTE' && (
                            <button
                              onClick={() => handleMarcarComoRetirado(item.id)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Marcar Retirada
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORMULÁRIO DE CADASTRO - SÓ APARECE NO MODO ADMIN */}
        {mode === 'admin' && (
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-800 mb-1">Registrar Entrada</h3>
            <p className="text-xs text-slate-400 mb-4">Insira os dados do pacote recebido na portaria.</p>
            
            <form onSubmit={handleRegistrarEncomenda} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Destinatário (Morador)</label>
                <select
                  required
                  value={moradorId}
                  onChange={(e) => setMoradorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
                >
                  <option value="">Selecione quem vai receber</option>
                  {moradores.map((m) => {
                    const blocoNome = m.apartamento?.bloco?.nome;
                    const unidadeInfo = m.apartamento 
                      ? (blocoNome ? `${blocoNome} - Apto ${m.apartamento.numero}` : `Apto ${m.apartamento.numero}`)
                      : 'Sem apto';
                    return (
                      <option key={m.id} value={m.id}>
                        {m.nome} ({unidadeInfo})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição do Volume</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Caixa Amazon, Entrega Mercado Livre"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={salvando || moradores.length === 0}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
              >
                {salvando ? 'Salvando...' : 'Dar Entrada'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}