import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, DollarSign, Activity } from 'lucide-react';

export default function DashboardAdministrador() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const { data, error } = await supabase
        .from('vista_administrador')
        .select('*');
      
      if (error) throw error;
      setDatos(data || []);
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
          <h1 className="text-2xl font-bold text-primary">Dashboard Administrador</h1>
          <p className="text-textMuted text-sm">Visión general del club Capital SK</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-slate-700"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {/* Tarjetas de Resumen (Ejemplo visual) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-cardBg p-6 rounded-2xl border border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/20 text-primary rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-textMuted text-sm">Total Deportistas</p>
            <p className="text-2xl font-bold">{datos.length}</p>
          </div>
        </div>
        <div className="bg-cardBg p-6 rounded-2xl border border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 text-blue-400 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-textMuted text-sm">Ingresos Estimados</p>
            <p className="text-2xl font-bold">Resumen</p>
          </div>
        </div>
        <div className="bg-cardBg p-6 rounded-2xl border border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-textMuted text-sm">Estado General</p>
            <p className="text-2xl font-bold">Activo</p>
          </div>
        </div>
      </div>

      <div className="bg-cardBg rounded-2xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold">Registro de Deportistas y Pagos</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-textMuted">Cargando datos...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-textMuted font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Teléfono</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">Valor Oficial</th>
                  <th className="px-6 py-4">Mes</th>
                  <th className="px-6 py-4">Valor Cobrado</th>
                  <th className="px-6 py-4">Estado Pago</th>
                  <th className="px-6 py-4">Fecha Pago</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {datos.length > 0 ? datos.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">{row.documento}</td>
                    <td className="px-6 py-4 font-medium text-slate-200">{row.nombre_deportista}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${row.estado_deportista === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {row.estado_deportista}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.telefono}</td>
                    <td className="px-6 py-4">{row.nombre_plan}</td>
                    <td className="px-6 py-4">${row.valor_plan_oficial}</td>
                    <td className="px-6 py-4">{row.mes}</td>
                    <td className="px-6 py-4">${row.valor_cobrado}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${row.estado_pago === 'Pagado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {row.estado_pago}
                      </span>
                    </td>
                    <td className="px-6 py-4">{row.fecha_pago}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-slate-500">
                      No hay datos disponibles en la vista.
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
