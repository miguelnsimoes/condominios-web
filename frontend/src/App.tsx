import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ListaMoradores from './pages/ListaMoradores';
import CadastroMorador from './pages/CadastroMorador';

function App() {
  const [tela, setTela] = useState<'lista' | 'cadastro'>('lista');

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {tela === 'lista' ? (
            <ListaMoradores onAdicionarMorador={() => setTela('cadastro')} />
          ) : (
            <CadastroMorador onCancelar={() => setTela('lista')} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;