import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ListaMoradores from './pages/ListaMoradores';
import CadastroMorador from './pages/CadastroMorador';
import CadastroEstrutura from './pages/CadastroEstrutura';
import EspacosReserva from './pages/EspacosReserva';
import Reservas from './pages/Reservas';
import Portaria from './pages/Portaria';
import Financeiro from './pages/Financeiro'; // <-- NOVO IMPORT ADICIONADO
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';
import { clearSession, getStoredToken, getUserRole, isAdm } from './services/auth';

type TelaAutenticacao = 'login' | 'cadastro_usuario' | 'sistema';
type SubTelaMoradores = 'lista' | 'cadastro';

function App() {
  const [telaPrincipal, setTelaPrincipal] = useState<TelaAutenticacao>(() =>
    getStoredToken() ? 'sistema' : 'login'
  );
  const [abaAtiva, setAbaAtiva] = useState<string>('unidades');
  const [subTelaMoradores, setSubTelaMoradores] = useState<SubTelaMoradores>('lista');
  const [moradorParaEdicao, setMoradorParaEdicao] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string>(() => getUserRole());

  const userIsAdm = isAdm(userRole);
  const abasAdm = ['estrutura', 'espacos-reserva', 'registrar-encomenda'];

  useEffect(() => {
    if (getStoredToken()) {
      setUserRole(getUserRole());
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    setUserRole('');
    setTelaPrincipal('login');
  };

  const handleEntrar = (role: string) => {
    setUserRole(role);
    setTelaPrincipal('sistema');
  };

  const handleMudarAba = (aba: string) => {
    if (abasAdm.includes(aba) && !userIsAdm) return;
    setAbaAtiva(aba);
  };

  const handleIniciarEdicao = (morador: any) => {
    setMoradorParaEdicao(morador);
    setSubTelaMoradores('cadastro');
  };

  if (telaPrincipal === 'login') {
    return (
      <Login 
        onEntrar={handleEntrar} 
        onIrParaCadastro={() => setTelaPrincipal('cadastro_usuario')} 
      />
    );
  }

  if (telaPrincipal === 'cadastro_usuario') {
    return (
      <CadastroUsuario 
        onCadastrar={() => setTelaPrincipal('login')} 
        onIrParaLogin={() => setTelaPrincipal('login')} 
      />
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased">
      <Sidebar 
        abaAtiva={abaAtiva} 
        setAbaAtiva={handleMudarAba} 
        onSair={handleLogout}
        isAdm={userIsAdm}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {abaAtiva === 'unidades' && (
            <>
              {subTelaMoradores === 'lista' ? (
                <ListaMoradores 
                  onAdicionarMorador={() => {
                    setMoradorParaEdicao(null);
                    setSubTelaMoradores('cadastro');
                  }} 
                  onEditarMorador={handleIniciarEdicao}
                />
              ) : (
                <CadastroMorador 
                  moradorExistente={moradorParaEdicao}
                  onCancelar={() => {
                    setMoradorParaEdicao(null);
                    setSubTelaMoradores('lista');
                  }} 
                />
              )}
            </>
          )}

          {abaAtiva === 'estrutura' && userIsAdm && <CadastroEstrutura />}

          {abaAtiva === 'espacos-reserva' && userIsAdm && <EspacosReserva />}

          {abaAtiva === 'reservas' && <Reservas />}

          {/* VISTA DO MORADOR: Apenas consulta filtrada */}
          {abaAtiva === 'portaria' && <Portaria mode="view" />}

          {/* VISTA DO ADM: Painel de gerenciamento completo */}
          {abaAtiva === 'registrar-encomenda' && userIsAdm && <Portaria mode="admin" />}

          {/* NOVO COMPONENTE FINANCEIRO */}
          {abaAtiva === 'financeiro' && <Financeiro />}

          {abaAtiva === 'painel' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800">Painel Geral</h2>
              <p className="text-sm text-slate-500 mt-1">Módulo geral do CondoManager.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;