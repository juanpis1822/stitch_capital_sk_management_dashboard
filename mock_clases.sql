-- Inyectar datos de prueba para las Clases y Asistencias
-- Ejecuta esto en Supabase para que el Entrenador tenga datos que mostrar

INSERT INTO public.clase (id_clase, fecha, hora, descripcion, id_entrenador)
VALUES 
(1, CURRENT_DATE, '16:00:00', 'Entrenamiento de Velocidad - Técnica', 1),
(2, CURRENT_DATE, '17:00:00', 'Fondo y Resistencia', 1)
ON CONFLICT (id_clase) DO NOTHING;

INSERT INTO public.asistencia (id_asistencia, estado_asistencia, deportista_id_deportista, clase_id_clase)
VALUES 
(1, 'Pendiente', 1, 1),
(2, 'Pendiente', 2, 1),
(3, 'Pendiente', 3, 2),
(4, 'Pendiente', 4, 2)
ON CONFLICT (id_asistencia) DO NOTHING;
