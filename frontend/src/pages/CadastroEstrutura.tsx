import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Bloco {
  id: number;
  nome: string;
}

interface CadastroEstruturaProps {
  onVoltar: () => void;
}

export default function CadastroEstrutura({ onVoltar }: CadastroEstruturaProps) {
  // Estados para os Blocos Existentes
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Estados para o formulário de Bloco
  const [nomeBloco, setNomeBloco] = useState('');
  const [loadingBloco, setLoadingBloco] = useState(false);

  // Estados para o formulário de Apartamento
  const [numeroApto, setNumeroApto] = useState('');
  const [blocoIdApto, setBlocoIdApto] = useState('');
  const [loadingApto, setLoadingApto] = useState(false);

  // Mensagens de feedback
  const [msgBloco, setMsgBloco] = useState({ tipo: '', texto: '' });
  const [msgApto, setMsgApto] = useState({ tipo: '', texto: '' });

  // Função para buscar os blocos reais da API
  async function carregarBlocos() {
    try {
      setLoadingList(true);
      const response = await api.get('/blocos');
      if (response.data && Array.isArray(response.data)) {
        setBlocos(response.data);
      } else if (response.data && Array.isArray(response.data.content)) {
        setBlocos(response.data.content);
      }
    } catch (error) {
      console.error("Erro ao carregar lista de blocos:", error);
    } finally {
      setLoadingList(false);
    }
  }

  // Carrega a lista assim que o componente entra na tela
  useEffect(() => {
    carregarBlocos();
  }, []);

  const handleSalvarBloco = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingBloco(true);
    setMsgBloco({ tipo: '', texto: '' });

    try {
      await api.post('/blocos', { nome: nomeBloco });
      setMsgBloco({ tipo: 'sucesso', texto: 'Bloco cadastrado com sucesso! 🎉' });
      setNomeBloco('');
      
      // Recarrega a lista para o ID novo aparecer instantaneamente na tela
      carregarBlocos();
    } catch (error: any) {
      console.error(error);
      setMsgBloco({ tipo: 'erro', texto: 'Erro ao salvar bloco. Verifique as permissões de ADM.' });
    } finally {
      setLoadingBloco(false);
    }
  };

  const handleSalvarApartamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingApto(true);
    setMsgApto({ tipo: '', texto: '' });

    try {
      await api.post('/apartamentos', {
        numero: numeroApto,
        bloco: {
          id: Number(blocoIdApto)
        }
      });
      setMsgApto({ tipo: 'sucesso', texto: 'Apartamento cadastrado com sucesso! 🏢' });
      setNumeroApto('');
      setBlocoIdApto('');
    } catch (error: any) {
      console.error(error);
      setMsgApto({ tipo: 'erro', texto: 'Erro ao salvar apartamento. Verifique se o ID do bloco existe.' });
    } finally {
      setLoadingApto(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurar Estrutura do Condomínio</h2>
          <p className="text-sm text-slate-500">Área restrita para administradores criarem novos blocos e unidades.</p>
        </div>
        <button
          onClick={onVoltar}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          ← Voltar para Lista
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1: CADASTRO DE BLOCO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <form onSubmit={handleSalvarBloco} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">1. Cadastrar Novo Bloco</h3>
              <p className="text-xs text-slate-400">Crie as divisões principais do condomínio.</p>
            </div>

            {msgBloco.texto && (
              <div className={`p-3 rounded-xl text-xs font-medium text-center ${
                msgBloco.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {msgBloco.texto}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Bloco</label>
              <input
                type="text"
                required
                value={nomeBloco}
                onChange={(e) => setNomeBloco(e.target.value)}
                placeholder="Ex: Bloco A, Torre Norte"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loadingBloco}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl disabled:bg-slate-400 transition-colors"
            >
              {loadingBloco ? 'Salvando...' : 'Criar Bloco'}
            </button>
          </form>
        </div>

        {/* COLUNA 2: LISTA DE BLOCOS EXISTENTES (A COLA QUE VOCÊ PRECISA) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Blocos Registrados</h3>
            <p className="text-xs text-slate-400">Consulte o ID do bloco para criar as unidades ao lado.</p>
          </div>

          <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[220px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3 pl-4">ID de Cópia</th>
                  <th className="p-3">Nome do Bloco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loadingList ? (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-xs text-slate-400">Carregando...</td>
                  </tr>
                ) : blocos.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-xs text-slate-400">Nenhum bloco no banco.</td>
                  </tr>
                ) : (
                  blocos.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 pl-4 font-mono font-bold text-blue-600 bg-blue-50/30 w-24 text-center">
                        {b.id}
                      </td>
                      <td className="p-3 font-medium text-slate-800">{b.nome}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUNA 3: CADASTRO DE APARTAMENTO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSalvarApartamento} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">2. Criar Unidade</h3>
              <p className="text-xs text-slate-400">Atribua uma moradia ao bloco correspondente.</p>
            </div>

            {msgApto.texto && (
              <div className={`p-3 rounded-xl text-xs font-medium text-center ${
                msgApto.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {msgApto.texto}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Número do Apartamento</label>
              <input
                type="text"
                required
                value={numeroApto}
                onChange={(e) => setNumeroApto(e.target.value)}
                placeholder="Ex: 101, 12, 44"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ID do Bloco Pertencente (Olhe no painel ao lado)</label>
              <input
                type="number"
                required
                value={blocoIdApto}
                onChange={(e) => setBlocoIdApto(e.target.value)}
                placeholder="Insira o ID destacado em azul"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loadingApto}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl disabled:bg-slate-400 transition-colors"
            >
              {loadingApto ? 'Salvando...' : 'Criar Unidade'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}