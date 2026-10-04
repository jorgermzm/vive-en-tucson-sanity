import {defineDocuments,defineLocations} from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {route:'/',filter:'_id == "homepage"'},
  {route:'/zonas/:slug',filter:'_type == "area" && slug.current == $slug'},
])

export const locations = {
  homepage: defineLocations({
    message:'Contenido usado en la página principal',
    tone:'positive',
    locations:[{title:'Inicio',href:'/'}],
  }),
  siteSettings: defineLocations({
    message:'Configuración global usada en todo el sitio',
    tone:'caution',
    locations:[{title:'Inicio',href:'/'}],
  }),
  area: defineLocations({
    select:{title:'title',slug:'slug.current'},
    resolve:(doc)=>({
      locations: doc?.slug
        ? [{title:doc.title || 'Zona',href:`/zonas/${doc.slug}`},{title:'Inicio',href:'/'}]
        : [{title:'Inicio',href:'/'}],
    }),
  }),
  video: defineLocations({locations:[{title:'Inicio',href:'/#video-destacado'}]}),
  article: defineLocations({locations:[{title:'Inicio',href:'/'}]}),
}
