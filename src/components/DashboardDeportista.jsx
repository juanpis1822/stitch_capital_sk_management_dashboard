import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Medal, Activity, CheckCircle2 } from 'lucide-react';

export default function DashboardDeportista() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData.user?.email;

      if (!userEmail) throw new Error('No se encontró sesión de usuario');

      // 1. Buscar el id del deportista basado en su correo
      const { data: deportistaData, error: deptError } = await supabase
        .from('DEPORTISTA')
        .select('id_deportista')
        .eq('correo', userEmail)
        .single();

      if (deptError || !deportistaData) throw new Error('Deportista no encontrado en la base de datos');

      // 2. Buscar en la vista usando el id_deportista
      const { data, error } = await supabase
        .from('vista_deportista')
        .select('*')
        .eq('id_deportista', deportistaData.id_deportista)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setPerfil(data || {
        nombre: 'Usuario',
        categoria: 'N/A',
        nombre_plan: 'N/A',
        estado_pago: 'N/A',
        total_clases_asistidas: 0
      });

    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-textMain flex items-center justify-center">Cargando tu perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-textMain p-6">
      <header className="flex justify-between items-center mb-8 bg-cardBg p-4 rounded-2xl shadow-sm border border-slate-700/50">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mi Perfil - Capital SK</h1>
          <p className="text-textMuted text-sm">Bienvenido de vuelta, {perfil?.nombre || 'Deportista'}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-slate-700"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
          {errorMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cardBg to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 text-primary">
              <Medal size={120} />
            </div>
            <p className="text-textMuted text-sm font-medium mb-1 relative z-10">Categoría Actual</p>
            <p className="text-3xl font-black text-white relative z-10">{perfil?.categoria}</p>
          </div>

          <div className="bg-gradient-to-br from-cardBg to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
             <div className="absolute -right-4 -top-4 opacity-10 text-blue-500">
              <Activity size={120} />
            </div>
            <p className="text-textMuted text-sm font-medium mb-1 relative z-10">Plan Activo</p>
            <p className="text-xl font-bold text-slate-200 relative z-10">{perfil?.nombre_plan}</p>
          </div>

          <div className="bg-gradient-to-br from-cardBg to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
            <p className="text-textMuted text-sm font-medium mb-1">Estado del Mes ({perfil?.mes || 'Actual'})</p>
            <div className="flex items-center gap-2 mt-1">
              {perfil?.estado_pago === 'Pagado' ? (
                <CheckCircle2 className="text-emerald-500" size={24} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-500 text-xs font-bold">!</div>
              )}
              <p className={`text-xl font-bold ${perfil?.estado_pago === 'Pagado' ? 'text-emerald-400' : 'text-red-400'}`}>
                {perfil?.estado_pago || 'Pendiente'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cardBg to-slate-800 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
            <p className="text-textMuted text-sm font-medium mb-1">Clases Asistidas</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {perfil?.total_clases_asistidas || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
