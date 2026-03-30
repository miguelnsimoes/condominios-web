import { Sidebar } from './components/Sidebar';
import { Moradores } from './pages/Moradores'; 

function App() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Moradores /> 
      </main>

    </div>
  )
}

export default App