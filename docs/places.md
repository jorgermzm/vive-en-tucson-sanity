# Google Places

Las rutas `/que-hacer`, `/restaurantes`, `/atracciones`, `/museos`,
`/hiking-outdoors` y `/vida-nocturna` muestran nombre,
dirección y fotos disponibles de lugares reales en el área de Tucson.
El diseño está separado de la fuente de datos: se puede sustituir `PlacesPage`
y conservar `getPlaces` o consumir `/api/places?category=restaurantes`.
También se aceptan `que-hacer`, `atracciones`, `museos`, `hiking-outdoors` y `vida-nocturna`; no se admiten
consultas libres de visitantes ni paginación ilimitada.

## Configuración

`GOOGLE_PLACES_API_KEY` se configura como Secret en Production y Preview en
Vercel, restringida a Places API (New). Nunca usar el prefijo NEXT_PUBLIC.
No se requieren credenciales de Google en Sanity ni en el navegador.

## Actualización

Cada carga nueva consulta Google. No hace falta redeploy para cambios de Google.
Una página ya abierta no se actualiza sola: hay que volver a abrirla o recargarla.
No hay importación masiva, cron ni almacenamiento de nombres, direcciones o fotos
de Google en Sanity. No se guardan respuestas en Data Cache, ISR ni CDN, conforme
a las restricciones de Places. React.cache solo deduplica dentro de un render.

Descubrimiento: una consulta de hasta 8 resultados para restaurantes, atracciones
y museos; dos consultas de hasta 8 para qué hacer, vida nocturna y hiking/outdoors. Los resultados se alternan,
se deduplican por ID, se excluyen cierres permanentes y se limitan a 12 tarjetas.
Los resultados no representan un censo completo ni una recomendación editorial.
Las consultas solicitan solamente datos de catálogo, sin reviews, ratings ni horarios.
Las fotos se solicitan cuando aparecen en pantalla. Links de categorías tienen
prefetch desactivado para evitar consultas anticipadas. Las llamadas generan uso
facturable de Google Maps Platform; controlar cuotas y consumo en Google Cloud.

## Selección editorial opcional

En Studio, crear una `Selección de lugares` por categoría. Solo guardar Place IDs
(de Google Place ID Finder) en `placeIds` para fijar hasta 12 lugares y su orden,
o `hiddenPlaceIds` para excluirlos de la búsqueda automática. Publicar la selección.
Sin documentos, el descubrimiento funciona automáticamente. No necesita token de
escritura ni modifica otros documentos. El esquema está en el Studio del mismo repo;
no desplegarlo con herramientas MCP de esquemas.

## Fotos y atribución

El servidor firma referencias de foto con caducidad de una hora. El endpoint de
foto verifica firma, caducidad y formato antes de consultar Google; redirige a una
URL HTTPS de googleusercontent.com sin revelar la API key. No pasa por next/image.
Las referencias y fotos no se guardan ni se suben a Sanity. Se muestran autores,
enlaces de fuente y atribución Google Maps, con enlaces a privacidad y términos.
Si falta una foto o falla su carga, la tarjeta conserva nombre y dirección.

## Verificación

`node --test tests/*.test.cjs`, `pnpm type-check`, `pnpm build`.
Comprobar las seis rutas con la clave del entorno de Vercel; ver nombres,
direcciones y fotos, autores, enlaces y ausencia de credenciales en respuestas.
Una categoría inválida debe devolver 400. Fotos con token inválido deben devolver
400 sin consultar Google. Si Google falla o falta la clave, catálogo 503 y una
pantalla con reintento; no se inventan negocios ni se muestran copias antiguas.

Referencias: https://developers.google.com/maps/documentation/places/web-service/policies
https://developers.google.com/maps/documentation/places/web-service/text-search
https://developers.google.com/maps/documentation/places/web-service/place-photos
