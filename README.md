# Acompa\u00f1aUMCE

Plataforma desarrollada con Next.js (App Router), Supabase y TypeScript. Este proyecto busca ofrecer una arquitectura limpia y modular para futuras funcionalidades.

## Instalaci\u00f3n

```bash
pnpm install # o npm install
cp .env.local.example .env.local
```

## Estructura del proyecto

- `app/` - Rutas principales de la aplicaci\u00f3n (`login`, `asistente`, `admin`, `recursos`).
- `lib/` - Clientes de Supabase y OpenAI.
- `components/` - Componentes reutilizables de interfaz.
- `middleware.ts` - Protecci\u00f3n de rutas seg\u00fan sesi\u00f3n y roles.

## Desarrollo

```bash
pnpm dev
```

Se recomienda trabajar en ramas del tipo `feature/<modulo>` para mantener organizado el desarrollo. El primer m\u00f3dulo es `feature/login`.
