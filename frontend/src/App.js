import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // ✅ Ajout de l'état recherche

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const tasksRes = await api.get('/tasks');
          setTasks(tasksRes.data);
          const userRes = await api.get('/auth/me');
          setUser(userRes.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des données:', err);
          setToken('');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    fetchUserData();
  }, [token]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setTasks([]);
    setUser(null);
    setSearchTerm(''); // ✅ Réinitialiser la recherche
  };

  // ✅ Filtrer les tâches en fonction du terme de recherche
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-body-bg">
        <Header onLogout={logout} tasks={[]} user={null} />
        <main className="flex-grow pt-16">
          <AuthForm setToken={setToken} setUser={setUser} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-body-bg">
      <Header onLogout={logout} tasks={tasks} user={user} />
      <main className="flex-grow pt-16 container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4 text-header-bg">Ma To-Do List</h1>
        
        {/* ✅ Barre de recherche */}
        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="🔍 Rechercher une tâche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="clear-search">
              ✖
            </button>
          )}
        </div>

        {/* ✅ Information du nombre de résultats */}
        <div className="search-info mb-3">
          {searchTerm ? (
            <span>{filteredTasks.length} résultat(s) pour "{searchTerm}"</span>
          ) : (
            <span>{tasks.length} tâche(s) au total</span>
          )}
        </div>

        <TaskForm setTasks={setTasks} />
        <TaskList tasks={filteredTasks} setTasks={setTasks} />
      </main>
      <Footer />
    </div>
  );
}

export default App;