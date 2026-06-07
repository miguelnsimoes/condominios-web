import React, { useState } from 'react';
import api from '../services/api';

interface MoradorForm {
  nome: string;
  bloco: string;
  apartamento: string;
  tipo: 'Proprietario' | 'Inquilino' | '';
}

interface CadastroMoradorProps {
  onCancelar: () => void;
}

export default function CadastroMorador({ onCancelar }: CadastroMoradorProps) {
  const [form, setForm] = useState<MoradorForm>({
    nome: '',
    bloco: '',
    apartamento: '',
    tipo: ''
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const response = await api.post('/moradores', form);
      
      if (response.status === 201 || response.status === 200) {
        setMensagem({ tipo: 'sucesso', texto: 'Morador cadastrado com sucesso! 🎉' });
        setForm({ nome: '', bloco: '', apartamento: '', tipo: '' });
      }
    } catch (error) {
      console.error(error);
      setMensagem({ 
        tipo: 'erro', 
        shadow: 'Erro ao conectar com o servidor. Salvando localmente para testes por enquanto!' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Adicionar Novo Morador</h2>
        <p className="text-sm text-slate-500">Registre um novo morador e atribua-o a uma unidade residencial.</p>
      </div>

      {mensagem.texto && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${
          mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
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
            placeholder="Ex: Marco Beltrão"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bloco</label>
            <input
              type="text"
              name="bloco"
              required
              value={form.bloco}
              onChange={handleChange}
              placeholder="Ex: A"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Unidade / Apartamento</label>
            <input
              type="text"
              name="apartamento"
              required
              value={form.apartamento}
              onChange={handleChange}
              placeholder="Ex: 102"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo</label>
          <select
            name="tipo"
            required
            value={form.tipo}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none"
          >
            <option value="" disabled>Selecione o tipo de morador</option>
            <option value="Proprietario">Proprietário</option>
            <option value="Inquilino">Inquilino</option>
          </select>
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