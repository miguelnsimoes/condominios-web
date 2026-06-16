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

  // Estados dos formulários
  const [nomeBloco, setNomeBloco] = useState('');
  const [blocoEmEdicao, setBlocoEmEdicao] = useState<Bloco | null>(null);
  const [loadingBloco, setLoadingBloco] = useState(false);

  const [numeroApto, setNumeroApto] = useState('');
  const [blocoIdApto, setBlocoIdApto] = useState('');
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

  const handleSalvarBloco = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBloco(true);
    setMsgBloco({ tipo: '', texto: '' });

    try {
      if (blocoEmEdicao) {
        await api.put(`/blocos/${blocoEmEdicao.id}`, { nome: nomeBloco });
        setMsgBloco({ tipo: 'sucesso', texto: 'Bloco atualizado! ✏️' });
        setBlocoEmEdicao(null);
      } else {
        await api.post('/blocos', { nome: nomeBloco });
        setMsgBloco({ tipo: 'sucesso', texto: 'Bloco criado! 🎉' });
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
    if (!window.confirm(`Excluir o ${nome}?`)) return;
    try {
      await api.delete(`/blocos/${id}`);
      carregarDados();
    } catch (error) {
      setMsgBloco({ tipo: 'erro', texto: 'Erro ao excluir bloco.' });
    }
  };

  const handleSalvarApartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingApto(true);
    setMsgApto({ tipo: '', texto: '' });

    try {
      await api.post('/apartamentos', {
        numero: numeroApto,
        bloco: { id: Number(blocoIdApto) }
      });
      setMsgApto({ tipo: 'sucesso', texto: 'Unidade criada! 🏢' });
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
    if (!window.confirm(`Excluir o apartamento ${numero}?`)) return;
    try {
      await api.delete(`/apartamentos/${id}`);
      carregarDados();
    } catch (error) {
      setMsgApto({ tipo: 'erro', texto: 'Erro ao excluir apartamento.' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Configurar Estrutura Organizacional</h2>
        <p className="text-sm text-slate-500">Crie, edite e visualize os blocos e os IDs dos apartamentos para vinculação.</p>
      </div>

      {/* LINHA 1: BLOCOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <form onSubmit={handleSalvarBloco} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">{blocoEmEdicao ? 'Editar Bloco' : '1. Novo Bloco'}</h3>
            {msgBloco.texto && <div className="p-3 text-xs font-medium rounded-xl text-center bg-slate-50">{msgBloco.texto}</div>}
            <input type="text" required value={nomeBloco} onChange={(e) => setNomeBloco(e.target.value)} placeholder="Ex: Bloco A" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <button type="submit" className="w-full py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl">{loadingBloco ? '...' : 'Salvar Bloco'}</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Blocos Cadastrados</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <tr><th className="p-3 pl-4 text-center w-20">ID</th><th className="p-3">Nome</th><th className="p-3 text-right pr-4">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blocos.map(b => (
                  <tr key={b.id}>
                    <td className="p-3 font-mono font-bold text-blue-600 bg-blue-50/20 text-center">{b.id}</td>
                    <td className="p-3 font-medium text-slate-800">{b.nome}</td>
                    <td className="p-3 text-right pr-4 space-x-2">
                      <button onClick={() => { setBlocoEmEdicao(b); setNomeBloco(b.nome); }}>✏️</button>
                      <button onClick={() => handleDeletarBloco(b.id, b.nome)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LINHA 2: APARTAMENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-100">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <form onSubmit={handleSalvarApartamento} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">2. Nova Unidade</h3>
            {msgApto.texto && <div className="p-3 text-xs font-medium rounded-xl text-center bg-slate-50">{msgApto.texto}</div>}
            <input type="text" required value={numeroApto} onChange={(e) => setNumeroApto(e.target.value)} placeholder="Número (Ex: 12)" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <input type="number" required value={blocoIdApto} onChange={(e) => setBlocoIdApto(e.target.value)} placeholder="ID do Bloco acima" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            <button type="submit" className="w-full py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl">Criar Unidade</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Unidades Disponíveis (IDs para Vínculo de Morador)</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <tr><th className="p-3 pl-4 text-center w-24">ID Morador</th><th className="p-3">Nº Apartamento</th><th className="p-3">Bloco</th><th className="p-3 text-right pr-4">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apartamentos.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-600 bg-emerald-50/20 text-center">{a.id}</td>
                    <td className="p-3 font-medium text-slate-800">Apto {a.numero}</td>
                    <td className="p-3 text-slate-500 text-xs font-semibold">{a.bloco?.nome || 'Sem Bloco'}</td>
                    <td className="p-3 text-right pr-4"><button onClick={() => handleDeletarApartamento(a.id, a.numero)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}