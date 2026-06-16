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

export default function CadastroEstrutura() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Estados dos formulários de Bloco
  const [nomeBloco, setNomeBloco] = useState('');
  const [blocoEmEdicao, setBlocoEmEdicao] = useState<Bloco | null>(null);
  const [loadingBloco, setLoadingBloco] = useState(false);

  // Estados dos formulários de Apartamento
  const [numeroApto, setNumeroApto] = useState('');
  const [blocoIdApto, setBlocoIdApto] = useState('');
  const [aptoEmEdicao, setAptoEmEdicao] = useState<Apartamento | null>(null);
  const [loadingApto, setLoadingApto] = useState(false);

  // Mensagens
  const [msgBloco, setMsgBloco] = useState({ tipo: '', texto: '' });
  const [msgApto, setMsgApto] = useState({ tipo: '', texto: '' });

  async function carregarDados() {
    try {
      setLoadingList(true);
      const [resBlocos, resAptos] = await Promise.all([
        api.get('/blocos'),
        api.get('/apartamentos')
      ]);

      setBlocos(Array.isArray(resBlocos.data) ? resBlocos.data : resBlocos.data.content || []);
      setApartamentos(Array.isArray(resAptos.data) ? resAptos.data : resAptos.data.content || []);
    } catch (error) {
      console.error("Erro ao carregar dados da estrutura:", error);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Salvar / Editar Bloco
  const handleSalvarBloco = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBloco(true);
    setMsgBloco({ tipo: '', texto: '' });

    try {
      if (blocoEmEdicao) {
        await api.put(`/blocos/${blocoEmEdicao.id}`, { nome: nomeBloco });
        setMsgBloco({ tipo: 'sucesso', texto: 'Bloco atualizado com sucesso! ✏️' });
        setBlocoEmEdicao(null);
      } else {
        await api.post('/blocos', { nome: nomeBloco });
        setMsgBloco({ tipo: 'sucesso', texto: 'Bloco criado com sucesso! 🎉' });
      }
      setNomeBloco('');
      carregarDados();
    } catch (error) {
      setMsgBloco({ tipo: 'erro', texto: 'Erro ao processar bloco.' });
    } finally {
      setLoadingBloco(false);
    }
  };

  const handleDeletarBloco = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o ${nome}?`)) return;
    try {
      await api.delete(`/blocos/${id}`);
      carregarDados();
    } catch (error) {
      setMsgBloco({ tipo: 'erro', texto: 'Erro ao excluir bloco. Verifique se há apartamentos vinculados.' });
    }
  };

  // Salvar / Editar Apartamento
  const handleSalvarApartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingApto(true);
    setMsgApto({ tipo: '', texto: '' });

    const payload = {
      numero: numeroApto,
      bloco: { id: Number(blocoIdApto) }
    };

    try {
      if (aptoEmEdicao) {
        // O ID do apartamento vai na URL, preservando a chave primária intacta no Postgres
        await api.put(`/apartamentos/${aptoEmEdicao.id}`, payload);
        setMsgApto({ tipo: 'sucesso', texto: 'Unidade atualizada com sucesso! ✏️' });
        setAptoEmEdicao(null);
      } else {
        await api.post('/apartamentos', payload);
        setMsgApto({ tipo: 'sucesso', texto: 'Unidade criada com sucesso! 🏢' });
      }
      setNumeroApto('');
      setBlocoIdApto('');
      carregarDados();
    } catch (error) {
      setMsgApto({ tipo: 'erro', texto: 'Erro ao salvar unidade.' });
    } finally {
      setLoadingApto(false);
    }
  };

  const handleDeletarApartamento = async (id: number, numero: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o apartamento ${numero}?`)) return;
    try {
      await api.delete(`/apartamentos/${id}`);
      carregarDados();
    } catch (error) {
      setMsgApto({ tipo: 'erro', texto: 'Erro ao excluir apartamento.' });
    }
  };

  const handleIniciarEdicaoApto = (apto: Apartamento) => {
    setAptoEmEdicao(apto);
    setNumeroApto(apto.numero);
    setBlocoIdApto(apto.bloco?.id ? String(apto.bloco.id) : '');
    setMsgApto({ tipo: '', texto: '' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurar Estrutura Organizacional</h2>
        <p className="text-sm text-slate-500">Crie, edite e gerencie blocos e unidades habitacionais para vincular moradores.</p>
      </div>

      {/* BLOCO DE CONFIGURAÇÃO DE BLOCOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <form onSubmit={handleSalvarBloco} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">{blocoEmEdicao ? '✏️ Editar Bloco' : '1. Novo Bloco'}</h3>
            {msgBloco.texto && (
              <div className={`p-3 text-xs font-medium rounded-xl text-center ${msgBloco.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {msgBloco.texto}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Bloco</label>
              <input type="text" required value={nomeBloco} onChange={(e) => setNomeBloco(e.target.value)} placeholder="Ex: Bloco A" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden" />
            </div>
            <div className="flex gap-2">
              {blocoEmEdicao && (
                <button type="button" onClick={() => { setBlocoEmEdicao(null); setNomeBloco(''); }} className="w-1/2 py-2 border text-slate-600 text-sm font-semibold rounded-xl">Cancelar</button>
              )}
              <button type="submit" className={`py-2 text-sm font-semibold text-white rounded-xl ${blocoEmEdicao ? 'w-1/2 bg-blue-600' : 'w-full bg-slate-900'}`}>
                {loadingBloco ? '...' : blocoEmEdicao ? 'Atualizar' : 'Criar Bloco'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Blocos Cadastrados</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[180px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <tr><th className="p-3 pl-4 text-center w-20">ID</th><th className="p-3">Nome</th><th className="p-3 text-right pr-4">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList && blocos.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-xs text-slate-400">Carregando...</td></tr>
                ) : blocos.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-xs text-slate-400">Nenhum bloco registrado.</td></tr>
                ) : (
                  blocos.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono font-bold text-blue-600 bg-blue-50/20 text-center">{b.id}</td>
                      <td className="p-3 font-medium text-slate-800">{b.nome}</td>
                      <td className="p-3 text-right pr-4 space-x-3 text-slate-400">
                        <button type="button" className="hover:text-blue-600" onClick={() => { setBlocoEmEdicao(b); setNomeBloco(b.nome); }}>✏️</button>
                        <button type="button" className="hover:text-rose-600" onClick={() => handleDeletarBloco(b.id, b.nome)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BLOCO DE CONFIGURAÇÃO DE APARTAMENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <form onSubmit={handleSalvarApartamento} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              {aptoEmEdicao ? `✏️ Alterar Número (ID: ${aptoEmEdicao.id})` : '2. Nova Unidade'}
            </h3>
            {msgApto.texto && (
              <div className={`p-3 text-xs font-medium rounded-xl text-center ${msgApto.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {msgApto.texto}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Número do Apartamento</label>
              <input 
                type="text" 
                required 
                value={numeroApto} 
                onChange={(e) => setNumeroApto(e.target.value)} 
                placeholder="Número (Ex: 12)" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ID do Bloco Pertencente</label>
              <input 
                type="number" 
                required 
                disabled={!!aptoEmEdicao} // <-- ISSO TRAVA O INPUT DO BLOCO SE FOR EDIÇÃO
                value={blocoIdApto} 
                onChange={(e) => setBlocoIdApto(e.target.value)} 
                placeholder="Olhar na tabela azul acima" 
                className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-hidden transition-all ${
                  aptoEmEdicao ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
                }`} 
              />
            </div>
            <div className="flex gap-2">
              {aptoEmEdicao && (
                <button type="button" onClick={() => { setAptoEmEdicao(null); setNumeroApto(''); setBlocoIdApto(''); }} className="w-1/2 py-2 border text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">Cancelar</button>
              )}
              <button type="submit" className={`py-2 text-sm font-semibold text-white rounded-xl ${aptoEmEdicao ? 'w-1/2 bg-blue-600 hover:bg-blue-700' : 'w-full bg-slate-900 hover:bg-slate-800'}`}>
                {loadingApto ? '...' : aptoEmEdicao ? 'Atualizar Número' : 'Criar Unidade'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Unidades Disponíveis (IDs para Vínculo de Morador)</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <tr><th className="p-3 pl-4 text-center w-24">ID Apartamento</th><th className="p-3">Nº Apartamento</th><th className="p-3">Bloco</th><th className="p-3 text-right pr-4">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingList && apartamentos.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-xs text-slate-400">Carregando...</td></tr>
                ) : apartamentos.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-xs text-slate-400">Nenhum apartamento registrado.</td></tr>
                ) : (
                  apartamentos.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-600 bg-emerald-50/20 text-center">{a.id}</td>
                      <td className="p-3 font-medium text-slate-800">Apto {a.numero}</td>
                      <td className="p-3 text-slate-500 text-xs font-semibold">{a.bloco?.nome || 'Sem Bloco'}</td>
                      <td className="p-3 text-right pr-4 text-slate-400 space-x-3">
                        <button type="button" className="hover:text-blue-600" onClick={() => handleIniciarEdicaoApto(a)}>✏️</button>
                        <button type="button" className="hover:text-rose-600" onClick={() => handleDeletarApartamento(a.id, a.numero)}>🗑️</button>
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