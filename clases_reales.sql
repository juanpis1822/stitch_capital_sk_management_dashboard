-- SCRIPT DE CLASES Y ENTRENADORES REALISTAS (OPCIÓN 1)
-- Respeta tu diagrama ER: Deportista -> Asistencia -> Clase -> Entrenador

-- 1. Asegurarnos de limpiar datos de prueba anteriores de clases, asistencias y entrenadores para no tener duplicados
DELETE FROM public.asistencia;
DELETE FROM public.clase;
DELETE FROM public.entrenador;

-- 2. Crear los 4 Entrenadores Específicos
INSERT INTO public.entrenador (id_entrenador, nombre, documento, correo, telefono) VALUES 
(1, 'Profesor Iniciación', '11111111', 'iniciacion@capitalsk.com', '3001111111'),
(2, 'Profesor Intermedio', '22222222', 'intermedio@capitalsk.com', '3002222222'),
(3, 'Profesor Avanzado', '33333333', 'avanzado@capitalsk.com', '3003333333'),
(4, 'Profesor Papás', '44444444', 'papas@capitalsk.com', '3004444444');

-- 3. Programar las Clases (Respetando la franja horaria que me diste: 4 a 6 pm entre semana, 8 a 10 am fin de semana)
-- Vamos a generar clases simulando que hoy es un día de semana (16:00 a 18:00) y el próximo es fin de semana (08:00 a 10:00)

-- Clases de Iniciación (Profesor 1)
INSERT INTO public.clase (id_clase, fecha, hora, descripcion, id_entrenador) VALUES 
(1, CURRENT_DATE, '16:00:00', 'Clase Iniciación (Semana) - Postura y Equilibrio', 1),
(2, CURRENT_DATE + INTERVAL '3 days', '08:00:00', 'Clase Iniciación (Fin de Semana) - Juegos en patines', 1);

-- Clases de Intermedio (Profesor 2)
INSERT INTO public.clase (id_clase, fecha, hora, descripcion, id_entrenador) VALUES 
(3, CURRENT_DATE, '16:00:00', 'Clase Intermedio (Semana) - Técnica de empuje', 2),
(4, CURRENT_DATE + INTERVAL '3 days', '08:00:00', 'Clase Intermedio (Fin de Semana) - Curvas', 2);

-- Clases de Avanzado (Profesor 3)
INSERT INTO public.clase (id_clase, fecha, hora, descripcion, id_entrenador) VALUES 
(5, CURRENT_DATE, '16:00:00', 'Clase Avanzado (Semana) - Resistencia y Fondo', 3),
(6, CURRENT_DATE + INTERVAL '3 days', '08:00:00', 'Clase Avanzado (Fin de Semana) - Sprint y Velocidad', 3);

-- Clases de Papás/Adultos (Profesor 4)
INSERT INTO public.clase (id_clase, fecha, hora, descripcion, id_entrenador) VALUES 
(7, CURRENT_DATE, '16:00:00', 'Clase Papás (Semana) - Acondicionamiento Físico', 4),
(8, CURRENT_DATE + INTERVAL '3 days', '08:00:00', 'Clase Papás (Fin de Semana) - Ruta recreativa', 4);

-- 4. Matricular a los Deportistas (Asistencia) en sus clases correspondientes según su categoría
-- id_deportista 3 (Miguel - Novato) -> Clases 1 y 2
INSERT INTO public.asistencia (id_asistencia, estado_asistencia, deportista_id_deportista, clase_id_clase) VALUES 
(1, 'Pendiente', 3, 1), (2, 'Pendiente', 3, 2);

-- id_deportista 2 (Ana - Intermedio) -> Clases 3 y 4
INSERT INTO public.asistencia (id_asistencia, estado_asistencia, deportista_id_deportista, clase_id_clase) VALUES 
(3, 'Pendiente', 2, 3), (4, 'Pendiente', 2, 4);

-- id_deportista 1 y 5 (Carlos y David - Avanzado) -> Clases 5 y 6
INSERT INTO public.asistencia (id_asistencia, estado_asistencia, deportista_id_deportista, clase_id_clase) VALUES 
(5, 'Pendiente', 1, 5), (6, 'Pendiente', 1, 6),
(7, 'Pendiente', 5, 5), (8, 'Pendiente', 5, 6);

-- id_deportista 4 (Sofia - Élite/Adultos) -> Clases 7 y 8
INSERT INTO public.asistencia (id_asistencia, estado_asistencia, deportista_id_deportista, clase_id_clase) VALUES 
(9, 'Pendiente', 4, 7), (10, 'Pendiente', 4, 8);
