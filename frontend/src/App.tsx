import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ListaMoradores from './pages/ListaMoradores';
import CadastroMorador from './pages/CadastroMorador';
import CadastroEstrutura from './pages/CadastroEstrutura';
import Reservas from './pages/Reservas';
import Login from './pages/Login';
import CadastroUsuario from './pages/CadastroUsuario';

type TelaAutenticacao = 'login' | 'cadastro_usuario' | 'sistema';
type SubTelaMoradores = 'lista' | 'cadastro' | 'estrutura';

function App() {
  const [telaPrincipal, setTelaPrincipal] = useState<TelaAutenticacao>('login');
  const [abaAtiva, setAbaAtiva] = useState<string>('unidades');
  const [subTelaMoradores, setSubTelaMoradores] = useState<SubTelaMoradores>('lista');
  
  // Estado para armazenar o morador que será editado
  const [moradorParaEdicao, setMoradorParaEdicao] = useState<any | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('@CondoManager:token');
    setTelaPrincipal('login');
  };

  const handleIniciarEdicao = (morador: any) => {
    setMoradorParaEdicao(morador);
    setSubTelaMoradores('cadastro');
  };

  const handleIniciarNovoCadastro = () => {
    setMoradorParaEdicao(null);
    setSubTelaMoradores('cadastro');
  };

  if (telaPrincipal === 'login') {
    return (
      <Login 
        onEntrar={() => setTelaPrincipal('sistema')} 
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
        setAbaAtiva={(aba) => {
          setAbaAtiva(aba);
          if (aba === 'unidades') setSubTelaMoradores('lista');
        }} 
        onSair={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {abaAtiva === 'unidades' && (
            <>
              {subTelaMoradores === 'lista' && (
                <ListaMoradores 
                  onAdicionarMorador={handleIniciarNovoCadastro} 
                  onGerenciarEstrutura={() => setSubTelaMoradores('estrutura')}
                  onEditarMorador={handleIniciarEdicao}
                />
              )}
              
              {subTelaMoradores === 'cadastro' && (
                <CadastroMorador 
                  moradorExistente={moradorParaEdicao}
                  onCancelar={() => {
                    setMoradorParaEdicao(null);
                    setSubTelaMoradores('lista');
                  }} 
                />
              )}

              {subTelaMoradores === 'estrutura' && (
                <CadastroEstrutura onVoltar={() => setSubTelaMoradores('lista')} />
              )}
            </>
          )}

          {abaAtiva === 'reservas' && <Reservas />}

          {abaAtiva === 'painel' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800">Painel Geral</h2>
              <p className="text-sm text-slate-500 mt-1">Módulo geral do CondoManager.</p>
            </div>
          )}

          {abaAtiva === 'portaria' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800">Controle de Portaria</h2>
              <p className="text-sm text-slate-500 mt-1">Módulo de monitoramento em desenvolvimento.</p>
            </div>
          )}

          {abaAtiva === 'financeiro' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-800">Financeiro</h2>
              <p className="text-sm text-slate-500 mt-1">Módulo de faturamento em desenvolvimento.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;