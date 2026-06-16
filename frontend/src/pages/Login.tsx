import React, { useState } from 'react';
import api from '../services/api';
import { saveSession } from '../services/auth';

interface LoginProps {
  onEntrar: (role: string) => void;
  onIrParaCadastro: () => void;
}

export default function Login({ onEntrar, onIrParaCadastro }: LoginProps) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        login,
        senha
      });

      const token = response.data.token;

      if (token) {
        const role = saveSession(token, response.data.role);

        if (!role) {
          setErro('Nao foi possivel identificar seu nivel de acesso. Reinicie o backend e tente novamente.');
          return;
        }

        onEntrar(role);
      } else {
        setErro('Token não recebido do servidor.');
      }

    } catch (error: any) {
      console.error(error);
      
      if (error.response) {
        const msgErro = error.response.data?.message || 'Credenciais inválidas.';
        setErro(msgErro);
      } else if (error.request) {
        setErro('Não foi possível sintonizar com o servidor. O Spring Boot está rodando na porta 8080?');
      } else {
        setErro('Erro ao processar a requisição de autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">CondoManager</h1>
        <h2 className="mt-4 text-xl font-bold text-slate-800">Acesse sua conta</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bem-vindo de volta ao portal do condomínio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 sm:rounded-2xl sm:px-10">
          
          {erro && (
            <div className="p-4 mb-6 rounded-xl text-sm font-medium text-center bg-rose-50 text-rose-700 border border-rose-100">
              {erro}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:bg-slate-400"
              >
                {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Não tem uma conta?{' '}
              <button
                onClick={onIrParaCadastro}
                className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}