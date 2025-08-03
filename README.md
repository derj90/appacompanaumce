# Acompa\u00f1aUMCE

Plataforma desarrollada con Next.js (App Router), Supabase y TypeScript. Este proyecto busca ofrecer una arquitectura limpia y modular para futuras funcionalidades.

## Instalaci\u00f3n

```bash
pnpm install # o npm install
cp .env.local.example .env.local
# Registrar la clave de OpenAI para la función Edge
supabase secrets set OPENAI_API_KEY=tu_clave
```

## Estructura del proyecto

- `app/` - Rutas principales de la aplicación (`login`, `asistente`, `admin`, `recursos`).
- `app/asistente` - Vista del asistente virtual que muestra el historial de preguntas y permite enviar nuevas invocando la función Edge `askAI`.
- `app/auth/callback` - Ruta de redirección posterior al inicio de sesión.
- `lib/` - Clientes de Supabase y OpenAI.
- `components/` - Componentes reutilizables de interfaz.
- `middleware.ts` - Protección de rutas según sesión y roles.
- `supabase/functions/askAI` - Función Edge que procesa preguntas con OpenAI.
## Desarrollo

```bash
pnpm dev
```

Se recomienda trabajar en ramas del tipo `feature/<modulo>` para mantener organizado el desarrollo. El primer m\u00f3dulo es `feature/login`.
