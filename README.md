# Vive en Tucson — Next.js + Sanity

Una sola aplicación para Vercel con frontend público, Sanity Studio en `/studio` y Presentation Tool / Visual Editing.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Web: http://localhost:3000  
Studio: http://localhost:3000/studio

## Variables de entorno

```
NEXT_PUBLIC_SANITY_PROJECT_ID=qpdnewuy
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-10-03
SANITY_API_READ_TOKEN=...
```

`SANITY_API_READ_TOKEN` debe ser un token Viewer y nunca debe exponerse como `NEXT_PUBLIC_*`.

## Vercel

1. Importa este repo como un solo proyecto.
2. Framework Preset: Next.js.
3. Root Directory: raíz del repo.
4. Agrega las variables anteriores.
5. Deploy.
6. Agrega el dominio final a Sanity CORS con credenciales habilitadas. Para previews puede usarse `https://*.vercel.app`.

## Rutas

- `/` — homepage.
- `/zonas` — zonas.
- `/zonas/[slug]` — detalle.
- `/studio` — Studio embebido.
- `/api/draft-mode/enable` — Draft Mode para Presentation.

Las propiedades de la homepage son placeholders marcados como Demo / IDX pendiente; no son listings MLS reales.
