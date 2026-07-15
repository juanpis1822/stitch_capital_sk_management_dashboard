-- CREAR USUARIOS DE ENTRENADORES EN SUPABASE AUTH Y ENLAZARLOS
-- Ejecuta este script en Supabase SQL Editor

-- 1. Actualizar los correos en la tabla 'entrenador' para que coincidan con lo que quieres
UPDATE public.entrenador SET correo = 'entrenador1@capitalsk.com' WHERE id_entrenador = 1;
UPDATE public.entrenador SET correo = 'entrenador2@capitalsk.com' WHERE id_entrenador = 2;
UPDATE public.entrenador SET correo = 'entrenador3@capitalsk.com' WHERE id_entrenador = 3;
UPDATE public.entrenador SET correo = 'entrenador4@capitalsk.com' WHERE id_entrenador = 4;

-- 2. Habilitar pgcrypto si no está
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Borrar usuarios de prueba si existían con esos correos para evitar errores
DELETE FROM auth.users WHERE email IN ('entrenador1@capitalsk.com', 'entrenador2@capitalsk.com', 'entrenador3@capitalsk.com', 'entrenador4@capitalsk.com');
DELETE FROM auth.identities WHERE email IN ('entrenador1@capitalsk.com', 'entrenador2@capitalsk.com', 'entrenador3@capitalsk.com', 'entrenador4@capitalsk.com');

-- 4. Crear los 4 Entrenadores en el sistema de Autenticación de Supabase (Contraseña: password123)
DO $$
DECLARE
    entrenador1_id uuid := gen_random_uuid();
    entrenador2_id uuid := gen_random_uuid();
    entrenador3_id uuid := gen_random_uuid();
    entrenador4_id uuid := gen_random_uuid();
BEGIN
    -- Insertar en auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES 
    ('00000000-0000-0000-0000-000000000000', entrenador1_id, 'authenticated', 'authenticated', 'entrenador1@capitalsk.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', entrenador2_id, 'authenticated', 'authenticated', 'entrenador2@capitalsk.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', entrenador3_id, 'authenticated', 'authenticated', 'entrenador3@capitalsk.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', entrenador4_id, 'authenticated', 'authenticated', 'entrenador4@capitalsk.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

    -- Insertar en auth.identities
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES
    (entrenador1_id, entrenador1_id, format('{"sub":"%s","email":"%s"}', entrenador1_id::text, 'entrenador1@capitalsk.com')::jsonb, 'email', now(), now(), now()),
    (entrenador2_id, entrenador2_id, format('{"sub":"%s","email":"%s"}', entrenador2_id::text, 'entrenador2@capitalsk.com')::jsonb, 'email', now(), now(), now()),
    (entrenador3_id, entrenador3_id, format('{"sub":"%s","email":"%s"}', entrenador3_id::text, 'entrenador3@capitalsk.com')::jsonb, 'email', now(), now(), now()),
    (entrenador4_id, entrenador4_id, format('{"sub":"%s","email":"%s"}', entrenador4_id::text, 'entrenador4@capitalsk.com')::jsonb, 'email', now(), now(), now());

END $$;
