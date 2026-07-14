# Proyecto: Capital SK - Sistema de Gestión de Escuela de Patinaje

Este es un prototipo funcional para un proyecto universitario de bases de datos.

## Comandos de Instalación
```bash
npm create vite@latest capital-sk -- --template react
cd capital-sk
npm install @supabase/supabase-js react-router-dom lucide-react
npm install -D tailwindcss border-opacity postcss autoprefixer
npx tailwindcss init -p
```

## Configuración de Supabase (.env)
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_llave_anonima
```

## Estructura de la Base de Datos (Vistas)
El sistema utiliza las siguientes vistas de PostgreSQL:
- `vista_administrador`
- `vista_deportista`
- `vista_entrenador`
