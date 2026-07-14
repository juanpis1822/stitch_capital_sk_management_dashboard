import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components
import Login from './components/Login';
import DashboardAdministrador from './components/DashboardAdministrador';
import DashboardEntrenador from './components/DashboardEntrenador';
import DashboardDeportista from './components/DashboardDeportista';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background text-textMain flex items-center justify-center">Cargando aplicación...</div>;
  }

  // Componente de ruta protegida básico
  const ProtectedRoute = ({ children }) => {
    if (!session) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardAdministrador />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/entrenador" 
          element={
            <ProtectedRoute>
              <DashboardEntrenador />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/deportista" 
          element={
            <ProtectedRoute>
              <DashboardDeportista />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
