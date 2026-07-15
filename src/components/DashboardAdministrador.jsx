import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, DollarSign, Activity, UserPlus, X } from 'lucide-react';

export default function DashboardAdministrador() {
  const [datos, setDatos] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showDeportistaModal, setShowDeportistaModal] = useState(false);
  const [deportistaEditando, setDeportistaEditando] = useState(null);
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

  const eliminarDeportista = async (idDeportista) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar a este deportista? Esta acción no se puede deshacer y borrará también sus pagos y asistencias.")) {
      const { error } = await supabase
        .from('deportista')
        .delete()
        .eq('id_deportista', idDeportista);
        
      if (error) {
        alert("Error al eliminar deportista: " + error.message);
      } else {
        setDatos(datos.filter(d => d.id_deportista !== idDeportista));
      }
    }
  };

  const abrirModalEdicion = (deportista) => {
    setDeportistaEditando(deportista);
    setShowDeportistaModal(true);
  };

  const handleGuardarDeportista = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const datosDeportista = {
      nombre: formData.get('nombre'),
      documento: formData.get('documento'),
      edad: parseInt(formData.get('edad')),
      categoria: formData.get('categoria'),
      telefono: formData.get('telefono'),
      correo: formData.get('correo'),
      plan_id_plan: parseInt(formData.get('plan_id'))
    };

    try {
      if (deportistaEditando) {
        const { error } = await supabase.from('deportista')
          .update(datosDeportista)
          .eq('id_deportista', deportistaEditando.id_deportista);
        if (error) throw error;
        alert("¡Deportista actualizado exitosamente!");
      } else {
        datosDeportista.estado = 'activo';
        const { data: insertData, error } = await supabase.from('deportista').insert([datosDeportista]).select();
        if (error) throw error;
        
        const idNuevoDeportista = insertData[0].id_deportista;

        let idEntrenador = null;
        if (datosDeportista.categoria === 'Iniciación') idEntrenador = 1;
        else if (datosDeportista.categoria === 'Intermedio') idEntrenador = 2;
        else if (datosDeportista.categoria === 'Avanzado') idEntrenador = 3;
        else if (datosDeportista.categoria === 'Papás') idEntrenador = 4;

        if (idEntrenador) {
          const { data: clases } = await supabase.from('clase').select('id_clase').eq('id_entrenador', idEntrenador);
          if (clases && clases.length > 0) {
            const asistencias = clases.map(c => ({
              estado_asistencia: 'Pendiente',
              deportista_id_deportista: idNuevoDeportista,
              clase_id_clase: c.id_clase
            }));
            await supabase.from('asistencia').insert(asistencias);
          }
        }
        alert("¡Deportista creado y matriculado exitosamente!");
      }
      
      setShowDeportistaModal(false);
      setDeportistaEditando(null);
      fetchDatos(); 
    } catch (error) {
      alert("Error al guardar deportista: " + error.message);
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
            onClick={() => {
              setDeportistaEditando(null);
              setShowDeportistaModal(true);
            }}
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
                  <th className="px-6 py-4">Acciones</th>
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
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${row.estado_pago === 'Pagado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30' : row.estado_pago === 'Pendiente' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/30'}`}
                      >
                        {row.estado_pago || 'Mora'}
                      </button>
                    </td>
                    <td className="px-6 py-4">{row.fecha_pago || 'No registra'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => abrirModalEdicion(row)}
                        className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                        title="Editar Deportista"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => eliminarDeportista(row.id_deportista)}
                        className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                        title="Eliminar Deportista"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
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
            <button onClick={() => { setShowDeportistaModal(false); setDeportistaEditando(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-primary">{deportistaEditando ? 'Editar Deportista' : 'Registrar Deportista'}</h2>
            <form onSubmit={handleGuardarDeportista} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Nombre Completo</label>
                  <input required name="nombre" defaultValue={deportistaEditando?.nombre_deportista} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Documento</label>
                  <input required name="documento" defaultValue={deportistaEditando?.documento} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Edad</label>
                  <input required name="edad" defaultValue={10} type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-textMuted">Categoría</label>
                  <select name="categoria" required className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-textMain appearance-none">
                    <option value="">Selecciona una categoría</option>
                    <option value="Iniciación">Iniciación</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Papás">Papás (Adultos)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textMuted mb-1">Teléfono</label>
                  <input name="telefono" defaultValue={deportistaEditando?.telefono} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs text-textMuted mb-1">Correo Electrónico (para inicio sesión)</label>
                  <input required name="correo" defaultValue={deportistaEditando?.documento ? '' : ''} placeholder="ejemplo@correo.com" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-textMuted mb-1">Plan Mensual</label>
                <select required name="plan_id" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary">
                  <option value="">Selecciona un plan...</option>
                  {planes.map(p => (
                    <option key={p.id_plan} value={p.id_plan}>{p.nombre_plan} - ${p.valor_mensual}</option>
                  ))}
                </select>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-emerald-400 text-slate-900 font-bold py-2 rounded-xl transition-colors mt-2">
                {isSubmitting ? 'Guardando...' : (deportistaEditando ? 'Actualizar Deportista' : 'Guardar Deportista')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
