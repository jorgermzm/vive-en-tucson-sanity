import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {titleField, seoField, demoField, refs} from './shared'

export const homepage = defineType({
  name: 'homepage',
  title: 'Página de inicio',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'inspiration', title: 'Inspírate'},
    {name: 'areas', title: 'Zonas'},
    {name: 'video', title: 'Video destacado'},
    {name: 'properties', title: 'Propiedades'},
    {name: 'contact', title: 'Contacto'},
    {name: 'stories', title: 'Historias y guías'},
    {name: 'about', title: 'Sobre Jorge'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    titleField,
    defineField({name: 'heroTitle', title: 'Título principal', type: 'string', group: 'hero', validation: (r) => r.required()}),
    defineField({name: 'heroSubtitle', title: 'Subtítulo', type: 'string', group: 'hero'}),
    defineField({name: 'heroDescription', title: 'Descripción', type: 'text', group: 'hero'}),
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'editorialImage',
      group: 'hero',
      description: 'Arrastra y suelta la imagen del hero. Puedes ajustar el encuadre con hotspot.',
    }),
    defineField({name: 'heroActions', title: 'Botones', type: 'array', group: 'hero', of: [defineArrayMember({type: 'link'})], validation: (r) => r.max(2)}),

    defineField({
      name: 'inspirationItems',
      title: 'Tarjetas de “Inspírate en Tucson”',
      type: 'array',
      group: 'inspiration',
      description: 'Cada tarjeta puede tener su propia imagen cargada directamente desde Sanity.',
      of: [defineArrayMember({type: 'homepageInspiration'})],
    }),

    refs('featuredAreas', 'Zonas destacadas', 'area'),
    refs('featuredVideos', 'Videos destacados', 'video'),
    defineField({
      name: 'videoGallery',
      title: 'Galería del video destacado',
      type: 'array',
      group: 'video',
      description: 'Arrastra varias imágenes y ordénalas desde Sanity.',
      of: [defineArrayMember({type: 'editorialImage'})],
      validation: (r) => r.max(8),
    }),

    defineField({
      name: 'propertyShowcase',
      title: 'Propiedades de muestra',
      type: 'array',
      group: 'properties',
      description: 'Bloques visuales temporales hasta conectar IDX. Todas las fotos son editables.',
      of: [defineArrayMember({type: 'homepageProperty'})],
      validation: (r) => r.max(8),
    }),

    defineField({name: 'contactHeading', title: 'Título de contacto', type: 'string', group: 'contact'}),
    defineField({name: 'contactAction', title: 'Botón de contacto', type: 'link', group: 'contact'}),
    defineField({
      name: 'contactBackgroundImage',
      title: 'Imagen de fondo del CTA',
      type: 'editorialImage',
      group: 'contact',
      description: 'Arrastra y suelta la imagen de fondo de la franja de contacto.',
    }),

    refs('featuredArticles', 'Artículos destacados', 'article'),
    defineField({
      name: 'storyCards',
      title: 'Historias / guías visuales',
      type: 'array',
      group: 'stories',
      description: 'Tarjetas visuales del homepage. Puedes subir cada portada directamente.',
      of: [defineArrayMember({type: 'homepageStory'})],
      validation: (r) => r.max(8),
    }),

    defineField({
      name: 'aboutImage',
      title: 'Imagen de la sección “Sobre Jorge”',
      type: 'editorialImage',
      group: 'about',
      description: 'Usada si no hay una foto de agente configurada en Configuración del sitio.',
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
    demoField,
  ],
})
