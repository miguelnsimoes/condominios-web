import React, { useEffect, useMemo, useState } from 'react';
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

interface Morador {
  id: number;
  nome: string;
  apartamento?: Apartamento;
}

interface AreaComum {
  id: number;
  nome: string;
}

interface ReservaArea {
  id: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  areaComum: AreaComum;
  morador: Morador;
}

interface ReservaForm {
  areaComumId: string;
  moradorId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  if (!ano || !mes || !dia) return data;
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(inicio: string, fim: string) {
  const cortar = (hora: string) => hora?.slice(0, 5) ?? '';
  return `${cortar(inicio)} - ${cortar(fim)}`;
}

function obterUnidade(morador: Morador) {
  const apto = morador.apartamento;
  if (!apto) return '-';
  const bloco = apto.bloco?.nome;
  return bloco ? `${bloco} - Apto ${apto.numero}` : `Apto ${apto.numero}`;
}

function areaEmUso(areaId: number, reservas: ReservaArea[]) {
  const hoje = new Date().toISOString().slice(0, 10);
  const agora = new Date().toTimeString().slice(0, 5);

  return reservas.some((reserva) => {
    if (!reserva.areaComum || reserva.areaComum.id !== areaId || reserva.data !== hoje) return false;
    const inicio = reserva.horaInicio?.slice(0, 5) || '00:00';
    const fim = reserva.horaFim?.slice(0, 5) || '00:00';
    return agora >= inicio && agora < fim;
  });
}

export default function Reservas() {
  const [areas, setAreas] = useState<AreaComum[]>([]);
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [reservas, setReservas] = useState<ReservaArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [form, setForm] = useState<ReservaForm>({
    areaComumId: '',
    moradorId: '',
    data: '',
    horaInicio: '',
    horaFim: '',
  });

  async function carregarDados() {
    try {
      setLoading(true);
      setErro('');
      
      // Alterado de /reservas-de-area/proximas para /reservas-de-area
      const [resAreas, resMoradores, resReservas] = await Promise.all([
        api.get('/areas-comuns'),
        api.get('/moradores'),
        api.get('/reservas-de-area'), 
      ]);

      setAreas(Array.isArray(resAreas.data) ? resAreas.data : resAreas.data?.content ?? []);
      setMoradores(Array.isArray(resMoradores.data) ? resMoradores.data : resMoradores.data?.content ?? []);
      setReservas(Array.isArray(resReservas.data) ? resReservas.data : resReservas.data?.content ?? []);
    } catch (err) {
      console.error("Erro no carregamento de reservas:", err);
      setErro('Nao foi possivel carregar os dados de reservas do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const areasComStatus = useMemo(() => {
    return areas.map((area) => ({
      ...area,
      status: areaEmUso(area.id, reservas) ? 'Em Uso' : 'Disponivel',
    }));
  }, [areas, reservas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.areaComumId || !form.moradorId || !form.data || !form.horaInicio || !form.horaFim) {
      setErro('Preencha todos os campos da reserva.');
      return;
    }

    setSalvando(true);
    setErro('');
    setSucesso('');

    // Adiciona segundos ":00" para evitar rejeição do LocalTime no Jackson
    const horaInicioFormatada = form.horaInicio.length === 5 ? `${form.horaInicio}:00` : form.horaInicio;
    const horaFimFormatada = form.horaFim.length === 5 ? `${form.horaFim}:00` : form.horaFim;

    try {
      await api.post('/reservas-de-area', {
        data: form.data,
        horaInicio: horaInicioFormatada,
        horaFim: horaFimFormatada,
        areaComum: { id: Number(form.areaComumId) },
        morador: { id: Number(form.moradorId) },
      });

      setSucesso('Reserva confirmada com sucesso! 🎉');
      setForm({ areaComumId: '', moradorId: '', data: '', horaInicio: '', horaFim: '' });
      carregarDados();
    } catch (err: any) {
      console.error(err);
      const mensagem = err.response?.data?.message || 'Erro ao criar reserva. Verifique a disponibilidade do horario.';
      setErro(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelarReserva = async (id: number) => {
    if (!window.confirm('Deseja cancelar esta reserva?')) return;

    try {
      setErro('');
      await api.delete(`/reservas-de-area/${id}`);
      setSucesso('Reserva cancelada com sucesso.');
      carregarDados();
    } catch (err) {
      console.error(err);
      setErro('Nao foi possivel cancelar a reserva.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Reservas de Areas Comuns</h2>
        <p className="text-sm text-slate-500">
          Gerencie os horarios, agendamentos e a utilizacao dos espacos coletivos do condominio.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && areas.length === 0 ? (
          <div className="col-span-full text-center text-sm text-slate-400 py-4">Carregando areas...</div>
        ) : areas.length === 0 ? (
          <div className="col-span-full text-center text-sm text-slate-400 py-4">
            Nenhuma área comum cadastrada. O administrador deve cadastrar espaços em "Espaços para Reserva".
          </div>
        ) : (
          areasComStatus.map((area) => (
            <div
              key={area.id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-600">
                  {area.nome ? area.nome.slice(0, 2).toUpperCase() : 'AC'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{area.nome}</h4>
                  <span
                    className={`text-xs font-medium ${
                      area.status === 'Disponivel' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {area.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Proximos Agendamentos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase bg-slate-50/70">
                  <th className="py-4 px-6">Espaco</th>
                  <th className="py-4 px-6">Morador</th>
                  <th className="py-4 px-6">Data e Horario</th>
                  <th className="py-4 px-6 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      Buscando reservas...
                    </td>
                  </tr>
                ) : reservas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      Nenhuma reserva agendada.
                    </td>
                  </tr>
                ) : (
                  reservas.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {reserva.areaComum?.nome ?? '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{reserva.morador?.nome ?? '-'}</span>
                          <span className="text-xs text-slate-400">
                            {reserva.morador ? obterUnidade(reserva.morador) : '-'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{formatarData(reserva.data)}</span>
                          <span className="text-xs text-slate-500">
                            {formatarHorario(reserva.horaInicio, reserva.horaFim)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleCancelarReserva(reserva.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Nova Reserva</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Selecionar Espaco</label>
              <select
                name="areaComumId"
                value={form.areaComumId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
              >
                <option value="">Selecione a area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Morador</label>
              <select
                name="moradorId"
                value={form.moradorId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
              >
                <option value="">Selecione o morador</option>
                {moradores.map((morador) => (
                  <option key={morador.id} value={morador.id}>
                    {morador.nome} ({obterUnidade(morador)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Inicio</label>
                <input
                  type="time"
                  name="horaInicio"
                  value={form.horaInicio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fim</label>
                <input
                  type="time"
                  name="horaFim"
                  value={form.horaFim}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={salvando || areas.length === 0 || moradores.length === 0}
              className="w-full mt-2 py-2 px-4 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
            >
              {salvando ? 'Salvando...' : 'Confirmar Reserva'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}