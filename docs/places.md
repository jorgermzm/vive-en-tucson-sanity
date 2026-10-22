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

Descubrimiento: hasta tres páginas de 20 resultados por consulta, con un máximo
final de 60 lugares por categoría. Dos consultas se alternan en qué hacer,
vida nocturna y hiking/outdoors, con el mismo límite final de 60. Los tokens de
paginación de Google permanecen en el servidor. Se deduplican IDs y se excluyen
cierres permanentes y lugares ocultos. Si Google devuelve menos, se muestra la
cantidad real, sin repetir lugares ni ampliar las búsquedas a otras zonas.
Se ordena por calificación descendente, luego por número de reseñas descendente;
los lugares sin calificación van al final. El navegador pagina 20 por pantalla
sobre el conjunto ya ordenado, sin otra consulta a Google al cambiar de página.
Los resultados no representan un censo completo ni una recomendación editorial.
Las consultas de catálogo solicitan calificación y cantidad de reseñas, pero no
el texto de reseñas, web ni horarios. Estos se piden solamente al abrir una ficha.
Las fotos se solicitan cuando aparecen en pantalla. Links de categorías tienen
prefetch desactivado para evitar consultas anticipadas. Las llamadas generan uso
facturable de Google Maps Platform; controlar cuotas y consumo en Google Cloud.

## Selección editorial opcional

En Studio, crear una `Selección de lugares` por categoría. Solo guardar Place IDs
(de Google Place ID Finder) en `placeIds` para seleccionar hasta 60 lugares,
o `hiddenPlaceIds` para excluirlos de la búsqueda automática. Publicar la selección.
Sin documentos, el descubrimiento funciona automáticamente. No necesita token de
escritura ni modifica otros documentos. El esquema está en el Studio del mismo repo;
no desplegarlo con herramientas MCP de esquemas.

## Fichas individuales

Foto, nombre y «Ver ficha» enlazan a `/lugares/[id]?categoria=restaurantes`.
Google Place Details se consulta desde el servidor, con la misma política
no-store. Metadata y contenido comparten la consulta en el render. Un ID mal
formado o inexistente devuelve 404; fallo del proveedor muestra reintento.
Los enlaces internos desactivan prefetch para no generar consultas pagadas
al pasar el ratón por tarjetas.

La ficha muestra foto, dirección, calificación, número de opiniones, web HTTPS,
mapa, teléfono y horarios cuando Google los proporciona. La descripción editorial
de Google se reproduce sin alterar. Hay hasta cuatro fotos con autor y fuente.
Las reseñas (hasta cinco) conservan texto, autor, fecha, enlace de la reseña y
atribuciones, con aviso de relevancia y de traducción cuando aplica. No se
inventan opiniones ni se copian reseñas de Yelp.

En Studio, `Ficha de lugar` permite publicar historia propia, recomendación de
Jorge, hasta tres videos reales del canal y cuatro IDs relacionados. Los textos
editoriales solo aparecen si están publicados. Sin asociación manual, se muestran
hasta tres videos de la categoría, identificados como tales. No se sugiere que
Jorge haya visitado el lugar. Sin videos de la categoría se muestra el enlace al
catálogo. Los relacionados automáticos son de la misma categoría en una zona
próxima, acotada al área de Tucson; un fallo no bloquea la ficha.

Las consultas adicionales de calificaciones y reseñas generan consumo facturable
de Google según los campos solicitados. No se cambian claves, cuotas ni planes.

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
