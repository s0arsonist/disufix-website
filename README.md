# Disufix Website

Tienda / sitio web de Disufix construido con **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** y **Prisma**, con autenticación vía **NextAuth v5**.

> Código fuente recuperado desde el deployment de Vercel (el repositorio original fue eliminado). Esta es la versión real reconstruida de los 111 archivos fuente.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v3 + `tailwindcss-animate` + componentes Radix UI
- **ORM / DB:** Prisma (`prisma/schema.prisma`)
- **Auth:** NextAuth v5 (`@auth/prisma-adapter`, estrategia JWT)
- **Pagos:** integración Wompi (`src/utils/wompi.ts`)
- **Estado:** Zustand
- **Analytics:** `@vercel/analytics`

## Requisitos

- Node.js 18.18+ (recomendado 20+)
- Una base de datos compatible con el `schema.prisma`

## Puesta en marcha

```bash
npm install            # instala dependencias y corre `prisma generate` (postinstall)
cp .env.example .env   # configura tus variables (DATABASE_URL, AUTH_SECRET, etc.)
npx prisma migrate dev # o `prisma db push` según tu flujo
npm run dev            # entorno de desarrollo en http://localhost:3000
```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | Linter (ESLint + config de Next) |
| `npm run seed` | Poblar la base de datos (`src/seed/seed-database.ts`) |

## Variables de entorno

Las variables reales viven en `.env.local` (ignorado por git). Define al menos:

- `DATABASE_URL`
- `AUTH_SECRET` / `NEXTAUTH_SECRET`
- Credenciales de Wompi y de correo (nodemailer) según tu configuración.

## Notas

- `.env.local` y `.vercel/` están en `.gitignore` y **no** deben subirse al repositorio.
