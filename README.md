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

Las tarjetas residenciales de la homepage son referencias visuales del entorno, no anuncios MLS. No muestran precios, disponibilidad ni características inventadas.

## Contenido e imágenes

Todas las fotografías se almacenan como assets de Sanity y pueden sustituirse por drag-and-drop en Studio. La biografía y los datos de perfil se editan en Configuración del sitio. Las descripciones completas y galerías se editan en cada Zona.

Las fotografías importadas de Wikimedia Commons tienen sus autores, fuentes y licencias documentados en `content/photo-credits.json` y en la página pública `/creditos`. Al sustituir una fotografía, revisa también su atribución. Los recortes de imágenes CC BY-SA conservan la licencia del original. Las fuentes editoriales de las seis zonas están en `content/area-sources.json`.

Las animaciones respetan `prefers-reduced-motion`; los enlaces mantienen un indicador de foco visible. Sin un video real publicado, el bloque destacado enlaza a la guía de la zona.
