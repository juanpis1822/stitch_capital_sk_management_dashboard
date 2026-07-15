import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, DollarSign, Activity, UserPlus, X } from 'lucide-react';

export default function DashboardAdministrador() {
  const [datos, setDatos] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [showDeportistaModal, setShowDeportistaModal] = useState(false);
  const [showEntrenadorModal, setShowEntrenadorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDatos();
    fetchPlanes();
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

  const fetchPlanes = async () => {
    try {
      const { data, error } = await supabase.from('plan').select('*');
      if (!error && data) {
        setPlanes(data);
      }
    } catch (err) {
      console.error("Error al cargar planes", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const togglePago = async (idMensualidad, estadoActual) => {
    if (!idMensualidad) {
      alert("Para poder editar pagos, asegúrate de correr el script 'actualizacion.sql' en Supabase.");
      return;
    }
    const nuevoEstado = estadoActual === 'Pagado' ? 'Pendiente' : 'Pagado';
    
    // UI Update
    setDatos(datos.map(d => d.id_mensualidad === idMensualidad ? { ...d, estado_pago: nuevoEstado } : d));

    // DB Update
    const { error } = await supabase
      .from('mensualidad')
      .update({ estado_pago: nuevoEstado })
      .eq('id_mensualidad', idMensualidad);

    if (error) {
      alert("Error al actualizar pago: " + error.message);
      setDatos(datos.map(d => d.id_mensualidad === idMensualidad ? { ...d, estado_pago: estadoActual } : d));
    }
  };

  const toggleEstado = async (idDeportista, estadoActual) => {
    if (!idDeportista) {
      alert("Para poder editar el estado, asegúrate de correr el script 'supabase_final.sql' en Supabase.");
      return;
    }
    const nuevoEstado = estadoActual?.toLowerCase() === 'activo' ? 'inactivo' : 'activo';
    
    // UI Update
    setDatos(datos.map(d => d.id_deportista === idDeportista ? { ...d, estado_deportista: nuevoEstado } : d));

    // DB Update
    const { error } = await supabase
      .from('deportista')
      .update({ estado: nuevoEstado })
      .eq('id_deportista', idDeportista);

    if (error) {
      alert("Error al actualizar estado: " + error.message);
      setDatos(datos.map(d => d.id_deportista === idDeportista ? { ...d, estado_deportista: estadoActual } : d));
    }
  };

  const handleCrearDeportista = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const nuevoDeportista = {
      nombre: formData.get('nombre'),
      documento: formData.get('documento'),
      edad: parseInt(formData.get('edad')),
      categoria: formData.get('categoria'),
      telefono: formData.get('telefono'),
      correo: formData.get('correo'),
      estado: 'activo',
      plan_id_plan: parseInt(formData.get('plan_id'))
    };

    try {
      // Necesitamos generar un id_deportista porque la tabla no tiene SERIAL por defecto en el SQL del usuario,
      // pero si lo tiene, esto puede fallar. Asumiremos que el usuario usa SERIAL o autoincrement.
      // Si falla, el usuario debe ajustar su SQL para que id_deportista sea autoincremental.
      const { error } = await supabase.from('deportista').insert([nuevoDeportista]);
      if (error) throw error;
      
      alert("¡Deportista creado exitosamente!");
      setShowDeportistaModal(false);
      fetchDatos(); // Recargar la tabla
    } catch (error) {
      alert("Error al crear deportista: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCrearEntrenador = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const nuevoEntrenador = {
      nombre: formData.get('nombre'),
      documento: formData.get('documento'),
      correo: formData.get('correo'),
      telefono: formData.get('telefono')
    };

    try {
      const { error } = await supabase.from('entrenador').insert([nuevoEntrenador]);
      if (error) throw error;
      
      alert("¡Entrenador creado exitosamente!");
      setShowEntrenadorModal(false);
    } catch (error) {
      alert("Error al crear entrenador: " + error.message + "\n\n¿Ya creaste la tabla ENTRENADOR en Supabase?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain p-6 relative">
      <header className="flex justify-between items-center mb-8 bg-cardBg p-4 rounded-2xl shadow-sm border border-slate-700/50">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard Administrador</h1>
          <p className="text-textMuted text-sm">Visión general del club Capital SK</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowEntrenadorModal(true)}
            className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-4 py-2 rounded-xl transition-all border border-blue-500/30 font-medium"
          >
            <UserPlus size={18} />
            <span className="hidden md:inline">Crear Entrenador</span>
          </button>
          <button 
            onClick={() => setShowDeportistaModal(true)}
            className="flex items-center gap-2 bg-primary/20 hover:bg-primary/40 text-primary px-4 py-2 rounded-xl transition-all border border-primary/30 font-medium"
          >
            <UserPlus size={18} />
            <span className="hidden md:inline">Crear Deportista</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-all border border-slate-700"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Tarjetas de Resumen */}
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
            <p className="text-textMuted text-sm">Ingresos Estimados (Pagados)</p>
            <p className="text-2xl font-bold">
              ${datos.filter(d => d.estado_pago === 'Pagado').reduce((acc, curr) => acc + Number(curr.valor_cobrado || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-cardBg p-6 rounded-2xl border border-slate-700/50 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-textMuted text-sm">Deportistas en Plataforma</p>
            <p className="text-2xl font-bold">{datos.length}</p>
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
                      <button 
                        onClick={() => toggleEstado(row.id_deportista, row.estado_deportista)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${row.estado_deportista === 'Activo' || row.estado_deportista === 'activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/30'}`}
                      >
                        {row.estado_deportista || 'activo'}
                      </button>
                    </td>
                    <td className="px-6 py-4">{row.telefono}</td>
                    <td className="px-6 py-4">{row.nombre_plan}</td>
                    <td className="px-6 py-4">${row.valor_plan_oficial}</td>
                    <td className="px-6 py-4">{row.mes}</td>
                    <td className="px-6 py-4">${row.valor_cobrado}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => togglePago(row.id_mensualidad, row.estado_pago)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${row.estado_pago === 'Pagado' || row.estado_pago === 'pagado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/30'}`}
                      >
                        {row.estado_pago || 'Pendiente'}
                      </button>
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

      {/* MODAL DEPORTISTA */}
      {showDeportistaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-cardBg border border-slate-700 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowDeportistaModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-primary">Registrar Deportista</h2>
            <form onSubmit={handleCrearDeportista} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Nombre Completo</label>
                  <input required name="nombre" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Documento</label>
                  <input required name="documento" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Edad</label>
                  <input required name="edad" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Categoría</label>
                  <input required name="categoria" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Teléfono</label>
                  <input name="telefono" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Correo Electrónico</label>
                  <input required name="correo" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-textMuted mb-1">Plan Inicial</label>
                <select required name="plan_id" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary">
                  <option value="">Selecciona un plan...</option>
                  {planes.map(p => (
                    <option key={p.id_plan} value={p.id_plan}>{p.nombre_plan} - ${p.valor_mensual}</option>
                  ))}
                </select>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-emerald-400 text-slate-900 font-bold py-2 rounded-xl transition-colors mt-2">
                {isSubmitting ? 'Guardando...' : 'Guardar Deportista'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ENTRENADOR */}
      {showEntrenadorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-cardBg border border-slate-700 p-6 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setShowEntrenadorModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-400">Registrar Entrenador</h2>
            <form onSubmit={handleCrearEntrenador} className="space-y-4">
              <div>
                <label className="block text-xs text-textMuted mb-1">Nombre Completo</label>
                <input required name="nombre" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-textMuted mb-1">Documento</label>
                <input required name="documento" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-textMuted mb-1">Correo Electrónico</label>
                <input required name="correo" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs text-textMuted mb-1">Teléfono</label>
                <input name="telefono" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded-xl transition-colors mt-2">
                {isSubmitting ? 'Guardando...' : 'Guardar Entrenador'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
