import React, { useState } from 'react';

interface Reserva {
  area: string;
  morador: string;
  unidade: string;
  data: string;
  horario: string;
}

export default function Reservas() {
  const areasDisponiveis = [
    { nome: 'Salão de Festas', icone: '🎉', status: 'Disponível' },
    { nome: 'Churrasqueira Gourmet', icone: '🍖', status: 'Disponível' },
    { nome: 'Quadra Poliesportiva', icone: '⚽', status: 'Em Uso' },
    { nome: 'Academia', icone: '💪', status: 'Disponível' },
  ];

  const [reservas, setReservas] = useState<Reserva[]>([
    { area: 'Salão de Festas', morador: 'Marco Beltrão', unidade: 'Bloco A - 102', data: '20/06/2026', horario: '18:00 - 23:00' },
    { area: 'Churrasqueira Gourmet', morador: 'Lúcia Silva', unidade: 'Bloco B - 405', data: '21/06/2026', horario: '11:00 - 16:00' },
  ]);

  const [form, setForm] = useState({
    area: '',
    morador: '',
    unidade: '',
    data: '',
    horario: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.area || !form.morador || !form.unidade || !form.data || !form.horario) return;

    setReservas(prev => [...prev, form]);
    setForm({ area: '', morador: '', unidade: '', data: '', horario: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reservas de Áreas Comuns</h2>
        <p className="text-sm text-slate-500">Gerencie os horários, agendamentos e a utilização dos espaços coletivos do condomínio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {areasDisponiveis.map((area, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                {area.icone}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{area.nome}</h4>
                <span className={`text-xs font-medium ${area.status === 'Disponível' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {area.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Próximos Agendamentos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/70">
                  <th className="py-4 px-6">Espaço</th>
                  <th className="py-4 px-6">Morador</th>
                  <th className="py-4 px-6">Data e Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {reservas.map((reserva, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{reserva.area}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{reserva.morador}</span>
                        <span className="text-xs text-slate-400">{reserva.unidade}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{reserva.data}</span>
                        <span className="text-xs text-slate-500">{reserva.horario}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Nova Reserva</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Selecionar Espaço</label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              >
                <option value="">Selecione a área</option>
                {areasDisponiveis.map((a, i) => (
                  <option key={i} value={a.nome}>{a.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Morador</label>
              <input
                type="text"
                name="morador"
                value={form.morador}
                onChange={handleChange}
                placeholder="Ex: Ricardo Pereira"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unidade</label>
              <input
                type="text"
                name="unidade"
                value={form.unidade}
                onChange={handleChange}
                placeholder="Ex: Bloco A - 310"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Data</label>
                <input
                  type="text"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  placeholder="25/06/2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Horário</label>
                <input
                  type="text"
                  name="horario"
                  value={form.horario}
                  onChange={handleChange}
                  placeholder="14:00 - 18:00"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}