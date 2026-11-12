import React, { useState } from 'react';
import api from '../services/api';

interface CadastroUsuarioProps {
  onCadastrar: () => void;
  onIrParaLogin: () => void;
}

export default function CadastroUsuario({ onCadastrar, onIrParaLogin }: CadastroUsuarioProps) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [role, setRole] = useState<'ADM' | 'FUNCIONARIO' | 'MORADOR'>('ADM');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    if (senha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem!' });
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        login,
        senha,
        role
      });

      setMensagem({ tipo: 'sucesso', texto: 'Conta criada com sucesso! Redirecionando para o login...' });
      
      setTimeout(() => {
        onIrParaLogin();
      }, 2000);

    } catch (error: any) {
      console.error(error);
      if (error.response) {
        const msgServidor = error.response.data?.message || 'Usuário já cadastrado ou dados inválidos.';
        setMensagem({ tipo: 'erro', texto: msgServidor });
      } else {
        setMensagem({ tipo: 'erro', texto: 'Não foi possível alcançar o servidor do banco de dados.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CondoManager</h1>
        <h2 className="mt-4 text-xl font-bold text-slate-800">Crie sua conta</h2>
        <p className="mt-2 text-sm text-slate-500">
          Preencha os dados abaixo para acessar o sistema
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          
          {mensagem.texto && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-medium text-center ${
              mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {mensagem.texto}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Usuário ou Email
              </label>
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ex: marcos@email.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nível de Acesso (Função)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition-all appearance-none"
              >
                <option value="ADM">Administrador</option>
                <option value="FUNCIONARIO">Funcionário</option>
                <option value="MORADOR">Morador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Confirmar Senha
              </label>
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já possui uma conta?{' '}
              <button onClick={onIrParaLogin} className="font-semibold text-slate-900 hover:underline">
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}