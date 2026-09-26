# Vive en Tucson — Sanity Studio

Studio standalone en TypeScript para el proyecto existente **qpdnewuy**, dataset **production**.
No contiene frontend Next.js ni Tailwind.

## Inicio
Requiere Node.js 22.12+ (recomendado Node 24) y npm.

```sh
npm ci
npm run dev
```

Abre http://localhost:3333 e inicia sesión con una cuenta autorizada en Sanity.
Los identificadores públicos vienen configurados. No se necesitan tokens para compilar.

## Contenido
- **siteSettings**: singleton para marca, navegación, contacto, redes y SEO.
- **homepage**: singleton para hero, botones y referencias destacadas.
- **area** (Zona): slug, descripción Portable Text, imágenes, galería, puntos de interés y videos.
- **video**: YouTube, miniatura, transcripción y zonas.
- **article**: contenido Portable Text y zonas relacionadas.
- **seo**, **editorialImage**, **link** y **richText**: tipos reutilizables.

Los singletons usan IDs siteSettings y homepage y no permiten duplicación desde Studio.
Las imágenes admiten hotspot, texto alternativo y crédito.

## Datos de demostración
Se cargaron por MCP en production seis zonas: Downtown Tucson, Oro Valley, Marana,
Dove Mountain, Northwest Tucson y Sahuarita; además configuración, portada, un artículo
y una ficha de video. Son 10 documentos publicados para consultar por API.
Todos tienen isDemo=true y seo.noIndex=true. No contienen precios, inventario MLS
ni afirmaciones comerciales verificadas. La ficha de video no tiene URL real;
las imágenes y el contacto están pendientes de contenido definitivo.

seed/demo.json conserva los IDs reales asignados por Sanity. Para restaurar documentos
faltantes después de iniciar sesión con `npx sanity login`:

```sh
npm run seed
```

El seed omite documentos existentes (incluidos borradores), no reemplaza cambios
editoriales y está limitado a este proyecto/dataset. Ejecutarlo de forma serial.

## Preparado para un frontend separado
lib/client.ts configura el cliente público con perspectiva published y API fechada.
lib/queries.ts contiene consultas para configuración, portada, zonas, videos y artículos.
Durante desarrollo pasa `{includeDemo: true}`; en producción usa
`{includeDemo: false}` y maneja resultados vacíos. Para detalles añade `slug`.
Las referencias destacadas también filtran demos.

Ejemplo de consumo (sin implementar frontend):

```ts
const areas = await client.fetch(AREAS_QUERY, {includeDemo: true})
```

Las consultas devuelven claves de arrays, datos de imágenes, crop/hotspot y SEO
con valores de respaldo. Respeta noIndex al generar metadatos. Quita isDemo y
revisa el SEO únicamente después de reemplazar el contenido de prueba.
Los listados están limitados a 100 elementos; implementar paginación al crecer.

```sh
npm run typegen
npm run typecheck
npm run build
```

Copia/adapta las consultas, el cliente y sanity.types.ts en el futuro repositorio
Next.js; Tailwind corresponde a ese frontend. Renderiza richText con Portable Text
y configura cdn.sanity.io para imágenes. Un servidor Next.js puede consultar el
dataset público sin token. Para previews autenticadas, usa un token de lectura
solo en servidor y configura CORS para el origen concreto cuando exista.
Nunca expongas tokens de escritura mediante SANITY_STUDIO_* o NEXT_PUBLIC_*.

## Esquema remoto y alojamiento
Los esquemas están definidos en este código. Para registrar el esquema tras
iniciar sesión en Sanity: `npm run schema:deploy`.
El alojamiento del Studio no forma parte de este repositorio inicial.
No se crearon proyectos, datasets ni integraciones IDX nuevos.
