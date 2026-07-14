import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Iniciar sesión con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Lógica de enrutamiento basada en el rol
      const userEmail = authData.user.email;

      if (userEmail === 'admin@capitalsk.com') {
        navigate('/admin');
      } else if (userEmail === 'entrenador@capitalsk.com') {
        navigate('/entrenador');
      } else {
        // Verificar si es un deportista
        const { data: deportista, error: dbError } = await supabase
          .from('DEPORTISTA')
          .select('id_deportista')
          .eq('correo', userEmail)
          .single();

        if (dbError || !deportista) {
          throw new Error('No se encontró el usuario en la base de datos de deportistas. Contacte al administrador.');
        } else {
          navigate('/deportista');
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-cardBg rounded-2xl shadow-xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 tracking-tight">
            CAPITAL SK
          </h1>
          <p className="text-textMuted mt-2">Sistema de Gestión Deportiva</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-textMain"
                placeholder="usuario@capitalsk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-textMain"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-primaryDark text-white rounded-xl font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
