import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, CalendarCheck } from 'lucide-react';

export default function DashboardEntrenador() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    try {
      const { data, error } = await supabase
        .from('Vista_Entrenador')
        .select('*');
      
      if (error) throw error;
      setClases(data || []);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-textMain p-6">
      <header className="flex justify-between items-center mb-8 bg-cardBg p-4 rounded-2xl shadow-sm border border-slate-700/50">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard Entrenador</h1>
          <p className="text-textMuted text-sm">Tus próximas clases y asistencias</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-slate-700"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      <div className="bg-cardBg rounded-2xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <CalendarCheck className="text-primary" />
          <h2 className="text-xl font-semibold">Clases Programadas</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-textMuted">Cargando clases...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-textMuted font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Hora</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Deportista</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Estado Asistencia</th>
                  <th className="px-6 py-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {clases.length > 0 ? clases.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">{row.fecha}</td>
                    <td className="px-6 py-4 font-mono">{row.hora}</td>
                    <td className="px-6 py-4">{row.descripcion_clase}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{row.nombre_deportista}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-700 rounded-lg text-xs">
                        {row.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${row.estado_asistencia === 'Asistió' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                        {row.estado_asistencia || 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => alert("Para guardar esto en la base de datos, la Vista_Entrenador necesita devolver el 'id_asistencia'. ¡Pero la UI está lista para conectarse!")}
                        className="text-xs bg-primary/20 hover:bg-primary/40 text-primary px-3 py-1.5 rounded-lg transition-colors font-medium border border-primary/30"
                      >
                        Marcar Asistencia
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No hay clases programadas para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
