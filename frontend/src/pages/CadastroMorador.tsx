import React, { useState } from 'react';
import api from '../services/api';

interface MoradorForm {
  nome: string;
  cpf: string;
  telefone: string;
  idade: number | '';
  apartamentoId: number | '';
}

interface CadastroMoradorProps {
  onCancelar: () => void;
}

export default function CadastroMorador({ onCancelar }: CadastroMoradorProps) {
  const [form, setForm] = useState<MoradorForm>({
    nome: '',
    cpf: '',
    telefone: '',
    idade: '',
    apartamentoId: ''
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'idade' || name === 'apartamentoId' ? (value ? Number(value) : '') : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    // Monta o payload idêntico ao modelo mapeado no seu Hibernate do Spring Boot
    const payload = {
      nome: form.nome,
      cpf: form.cpf,
      telefone: form.telefone,
      idade: form.idade,
      apartamento: {
        id: form.apartamentoId
      }
    };

    try {
      const response = await api.post('/moradores', payload);
      
      if (response.status === 201 || response.status === 200) {
        setMensagem({ tipo: 'sucesso', texto: 'Morador salvo no banco de dados com sucesso! 🎉' });
        
        setTimeout(() => {
          onCancelar(); // Volta para a listagem atualizada
        }, 1500);
      }
    } catch (error: any) {
      console.error(error);
      const msgErro = error.response?.data?.message || 'Erro ao salvar. Verifique se o ID do apartamento existe no banco.';
      setMensagem({ tipo: 'erro', texto: msgErro });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Adicionar Novo Morador</h2>
        <p className="text-sm text-slate-500">Registre um morador vinculando-o ao ID de um apartamento existente.</p>
      </div>

      {mensagem.texto && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium text-center ${
          mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Morador</label>
          <input
            type="text"
            name="nome"
            required
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Miguel Nazário"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">CPF</label>
            <input
              type="text"
              name="cpf"
              required
              value={form.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefone</label>
            <input
              type="text"
              name="telefone"
              required
              value={form.telefone}
              onChange={handleChange}
              placeholder="(43) 99999-9999"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Idade</label>
            <input
              type="number"
              name="idade"
              required
              value={form.idade}
              onChange={handleChange}
              placeholder="Ex: 20"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ID do Apartamento (Existente no Banco)</label>
            <input
              type="number"
              name="apartamentoId"
              required
              value={form.apartamentoId}
              onChange={handleChange}
              placeholder="Ex: 1"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            {loading ? 'Salvando...' : 'Salvar Morador'}
          </button>
        </div>
      </form>
    </div>
  );
}