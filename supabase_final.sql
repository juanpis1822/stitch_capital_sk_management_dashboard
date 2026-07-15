-- CORRE ESTE SCRIPT EN EL SQL EDITOR DE SUPABASE PARA QUE FUNCIONE LA EDICIÓN DE PAGOS Y ESTADO

-- 1. Actualizar la vista del administrador para incluir el id_mensualidad y el id_deportista
DROP VIEW IF EXISTS public.vista_administrador CASCADE;
CREATE VIEW public.vista_administrador AS
SELECT 
    d.id_deportista,
    d.documento,
    d.nombre AS nombre_deportista,
    d.estado AS estado_deportista,
    d.telefono,
    p.nombre_plan,
    p.valor_mensual AS valor_plan_oficial,
    m.id_mensualidad,
    m.mes::TEXT AS mes,
    m.valor AS valor_cobrado,
    m.estado_pago,
    TO_CHAR(m.fecha_pago, 'YYYY-MM-DD') AS fecha_pago
FROM 
    public.deportista d
LEFT JOIN 
    public.plan p ON d.plan_id_plan = p.id_plan
LEFT JOIN 
    public.mensualidad m ON d.id_deportista = m.deportista_id_deportista;

-- 2. Asegurarse de que la vista del entrenador esté bien configurada
DROP VIEW IF EXISTS public."Vista_Entrenador" CASCADE;
CREATE VIEW public."Vista_Entrenador" AS
SELECT 
    c.fecha,
    c.hora,
    c.descripcion AS descripcion_clase,
    d.nombre AS nombre_deportista,
    d.categoria,
    a.estado_asistencia,
    a.id_asistencia
FROM 
    public.clase c
JOIN 
    public.asistencia a ON c.id_clase = a.clase_id_clase
JOIN 
    public.deportista d ON a.deportista_id_deportista = d.id_deportista;

-- 3. Crear vista de deportista
DROP VIEW IF EXISTS public.vista_deportista CASCADE;
CREATE VIEW public.vista_deportista AS
SELECT 
    d.id_deportista,
    d.nombre,
    d.categoria,
    p.nombre_plan,
    m.mes::TEXT AS mes,
    m.estado_pago,
    (
        SELECT count(*) 
        FROM public.asistencia a 
        WHERE a.deportista_id_deportista = d.id_deportista 
        AND (a.estado_asistencia = 'asistió' OR a.estado_asistencia = 'Asistió')
    ) AS total_clases_asistidas
FROM 
    public.deportista d
LEFT JOIN 
    public.plan p ON d.plan_id_plan = p.id_plan
LEFT JOIN 
    (
        SELECT deportista_id_deportista, mes, estado_pago
        FROM public.mensualidad
        WHERE id_mensualidad IN (
            SELECT MAX(id_mensualidad) 
            FROM public.mensualidad 
            GROUP BY deportista_id_deportista
        )
    ) m ON d.id_deportista = m.deportista_id_deportista;
