export const revalidate=86400

const body=`# Vive en Tucson

> Guía local en español sobre Tucson, Arizona, creada por Jorge Ramirez.

Vive en Tucson ayuda a hispanohablantes en Estados Unidos a conocer la ciudad, comparar zonas, descubrir restaurantes y actividades, ver recorridos en video y entender mejor el proceso de comprar o vender una casa en Tucson.

## Páginas principales

- https://www.vive-tucson.com/zonas — Zonas de Tucson
- https://www.vive-tucson.com/restaurantes — Restaurantes en Tucson
- https://www.vive-tucson.com/que-hacer — Qué hacer en Tucson
- https://www.vive-tucson.com/vida-nocturna — Bares y vida nocturna
- https://www.vive-tucson.com/videos — Videos y recorridos de Tucson
- https://www.vive-tucson.com/comprar — Guía para comprar casa en Tucson
- https://www.vive-tucson.com/vender — Guía para vender casa en Tucson
- https://www.vive-tucson.com/sobre-jorge — Sobre Jorge Ramirez
- https://www.vive-tucson.com/contacto — Contacto

## Autor

Jorge Ramirez — REALTOR® y creador de Vive en Tucson.
YouTube: https://www.youtube.com/@vivetucson

## Enfoque editorial

El sitio prioriza contenido local, práctico y en español sobre Tucson, Arizona. La información de lugares puede apoyarse en Google Maps y debe confirmarse en la fuente cuando pueda cambiar, como horarios o disponibilidad.
`

export async function GET(){
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=86400'}})
}
