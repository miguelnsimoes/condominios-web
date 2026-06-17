import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getUserRole } from '../services/auth';

interface Morador {
  id: number;
  nome: string;
}

interface Pagamento {
  id: number;
  valor: number;
  dataPagamento: string | null;
  dataVencimento: string;
  referencia: string;
  morador: Morador;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO';
}

function formatarData(dataIso: string) {
  if (!dataIso) return '-';
  try {
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return dataIso;
  }
}

function formatarReferencia(referencia: string) {
  if (!referencia || !referencia.includes('-')) return referencia;
  const [ano, mes] = referencia.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const index = parseInt(mes, 10) - 1;
  return `${meses[index]} / ${ano}`;
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export default function Financeiro() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const userRole = getUserRole();
  const isAdm = userRole === 'ADM' || userRole === 'FUNCIONARIO';

  // Estados do Formulário
  const [valorInput, setValorInput] = useState('');
  const [moradorIdInput, setMoradorIdInput] = useState('');
  const [vencimentoInput, setVencimentoInput] = useState('');

  async function carregarDados() {
    try {
      setLoading(true);
      setErro('');

      let urlPagamentos = '/pagamentos';
      
      if (!isAdm) {
        const moradorId = localStorage.getItem('@CondoManager:moradorId');
        if (moradorId) {
          urlPagamentos = `/pagamentos?moradorId=${moradorId}`;
        }
      }

      const [resPagamentos, resMoradores] = await Promise.all([
        api.get(urlPagamentos),
        isAdm ? api.get('/moradores') : Promise.resolve({ data: [] })
      ]);

      setPagamentos(Array.isArray(resPagamentos.data) ? resPagamentos.data : resPagamentos.data?.content ?? []);
      if (isAdm) {
        setMoradores(Array.isArray(resMoradores.data) ? resMoradores.data : resMoradores.data?.content ?? []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados financeiros:", err);
      setErro('Não foi possível carregar as informações financeiras.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [isAdm]);

  const handleCriarCobranca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valorInput || !moradorIdInput) {
      setErro('Preencha o valor e escolha o morador.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso('');

    const payload = {
      valor: parseFloat(valorInput),
      morador: { id: Number(moradorIdInput) },
      dataVencimento: vencimentoInput || null,
      dataPagamento: null
    };

    try {
      await api.post('/pagamentos', payload);
      setSucesso('Cobrança emitida com sucesso no sistema. 💰');
      setValorInput('');
      setMoradorIdInput('');
      setVencimentoInput('');
      carregarDados();
    } catch (err) {
      setErro('Erro ao registrar cobrança no servidor.');
    } finally {
      setSalvando(false);
    }
  };

  const handleQuitarFatura = async (id: number) => {
    try {
      setErro('');
      await api.put(`/pagamentos/${id}/pagar`);
      setSucesso('Pagamento confirmado e baixado com sucesso! ✓');
      carregarDados();
    } catch (err) {
      setErro('Erro ao tentar processar o pagamento.');
    }
  };

  const pendentes = pagamentos.filter(p => p.status === 'PENDENTE' || p.status === 'ATRASADO').reduce((acc, p) => acc + p.valor, 0);
  const pagos = pagamentos.filter(p => p.status === 'PAGO').reduce((acc, p) => acc + p.valor, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          {isAdm ? 'Controle Financeiro Geral' : 'Minhas Mensalidades'}
        </h2>
        <p className="text-sm text-slate-500">
          {isAdm 
            ? 'Monitore a receita arrecadada, inadimplências e emita taxas extraordinárias.' 
            : 'Consulte o histórico de faturas e a situação das taxas do seu condomínio.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAdm ? 'Total em Aberto / Atrasado' : 'Total Pendente'}
            </p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{formatarMoeda(pendentes)}</p>
          </div>
          <div className="w-10 h-12 flex items-center justify-center text-xl bg-slate-50 rounded-xl">⏳</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAdm ? 'Total Arrecadado' : 'Total Pago'}
            </p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{formatarMoeda(pagos)}</p>
          </div>
          <div className="w-10 h-12 flex items-center justify-center text-xl bg-slate-50 rounded-xl">✓</div>
        </div>
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
        
        <div className={`${isAdm ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden h-fit`}>
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Fluxo de Cobranças</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                  {isAdm && <th className="py-4 px-6">Morador</th>}
                  <th className="py-4 px-6">Referência</th>
                  <th className="py-4 px-6">Vencimento</th>
                  <th className="py-4 px-6">Valor</th>
                  <th className="py-4 px-6">Situação</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr><td colSpan={isAdm ? 6 : 5} className="py-8 text-center text-slate-400 font-medium">Buscando faturas...</td></tr>
                ) : pagamentos.length === 0 ? (
                  <tr><td colSpan={isAdm ? 6 : 5} className="py-8 text-center text-slate-400 font-medium">Nenhum registro financeiro encontrado.</td></tr>
                ) : (
                  pagamentos.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {isAdm && (
                        <td className="py-4 px-6 font-semibold text-slate-900">
                          {item.morador?.nome ?? 'Não identificado'}
                        </td>
                      )}
                      <td className="py-4 px-6 font-medium text-slate-800">{formatarReferencia(item.referencia)}</td>
                      <td className="py-4 px-6 text-slate-500">{formatarData(item.dataVencimento)}</td>
                      <td className="py-4 px-6 font-bold text-slate-800">{formatarMoeda(item.valor)}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'PAGO' ? 'bg-emerald-50 text-emerald-700' :
                          item.status === 'ATRASADO' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {item.status !== 'PAGO' ? (
                          <button
                            onClick={() => handleQuitarFatura(item.id)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            {isAdm ? 'Confirmar Recebimento' : 'Pagar Fatura'}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            Pago em: {formatarData(item.dataPagamento || '')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isAdm && (
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 h-fit">
            <h3 className="font-bold text-slate-800 mb-1">Lançar Taxa Extra</h3>
            <p className="text-xs text-slate-400 mb-4">Gere faturas extras ou multas específicas.</p>
            
            <form onSubmit={handleCriarCobranca} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Devedor (Morador)</label>
                <select
                  required
                  value={moradorIdInput}
                  onChange={(e) => setMoradorIdInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
                >
                  <option value="">Selecione o residente</option>
                  {moradores.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Valor da Cobrança (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={valorInput}
                  onChange={(e) => setValorInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Vencimento (Opcional)</label>
                <input
                  type="date"
                  value={vencimentoInput}
                  onChange={(e) => setVencimentoInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={salvando || moradores.length === 0}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
              >
                {salvando ? 'Processando...' : 'Emitir Cobrança'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}