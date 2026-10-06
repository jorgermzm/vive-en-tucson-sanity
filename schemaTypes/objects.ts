import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {ImageIcon} from '@sanity/icons/Image'
import {LinkIcon} from '@sanity/icons/Link'

export const editorialImage = defineType({
  name: 'editorialImage',
  title: 'Imagen',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texto alternativo',
      type: 'string',
      description: 'Describe brevemente la imagen para accesibilidad y SEO.',
      validation: (r) => r.required().warning('Agrega texto alternativo para SEO y accesibilidad.'),
    }),
    defineField({name: 'caption', title: 'Pie de imagen', type: 'string'}),
    defineField({name: 'credit', title: 'Crédito', type: 'string'}),
  ],
})

export const homepageInspiration = defineType({
  name: 'homepageInspiration',
  title: 'Categoría visual',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'subtitle', title: 'Subtítulo', type: 'string'}),
    defineField({name: 'icon', title: 'Icono / símbolo', type: 'string', description: 'Opcional. Ejemplo: 🍴, △, ♫'}),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'editorialImage',
      description: 'Arrastra y suelta aquí la imagen que quieres mostrar en la tarjeta.',
    }),
    defineField({name: 'href', title: 'Destino', type: 'string', description: 'Ejemplo: /videos, /zonas o /que-hacer/restaurantes'}),
  ],
  preview: {select: {title: 'title', subtitle: 'subtitle', media: 'image'}},
})

export const homepageProperty = defineType({
  name: 'homepageProperty',
  title: 'Propiedad destacada',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'editorialImage',
      description: 'Arrastra y suelta una foto de la propiedad. Este bloque es de demostración hasta conectar IDX.',
    }),
    defineField({name: 'price', title: 'Precio', type: 'string'}),
    defineField({name: 'propertyType', title: 'Tipo de propiedad', type: 'string'}),
    defineField({name: 'bedrooms', title: 'Recámaras', type: 'number', validation: (r) => r.min(0)}),
    defineField({name: 'bathrooms', title: 'Baños', type: 'number', validation: (r) => r.min(0)}),
    defineField({name: 'size', title: 'Tamaño', type: 'string', description: 'Ejemplo: 1,680 sqft'}),
    defineField({name: 'location', title: 'Ubicación', type: 'string'}),
  ],
  preview: {select: {title: 'price', subtitle: 'location', media: 'image'}},
})

export const homepageStory = defineType({
  name: 'homepageStory',
  title: 'Historia / guía destacada',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'editorialImage',
      description: 'Arrastra y suelta la imagen de portada.',
    }),
    defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tag', title: 'Etiqueta', type: 'string'}),
    defineField({name: 'href', title: 'Destino', type: 'string', description: 'Ejemplo: /videos o /comprar'}),
  ],
  preview: {select: {title: 'title', subtitle: 'tag', media: 'image'}},
})

export const seo = defineType({
  name: 'seo', title: 'SEO', type: 'object', icon: DocumentIcon,
  fields: [
    defineField({name: 'title', title: 'Título SEO', type: 'string', validation: (r) => r.max(60).warning()}),
    defineField({name: 'description', title: 'Descripción', type: 'text', rows: 3, validation: (r) => r.max(160).warning()}),
    defineField({name: 'image', title: 'Imagen para compartir', type: 'editorialImage'}),
    defineField({name: 'canonicalUrl', title: 'URL canónica', type: 'url', validation: (r) => r.uri({scheme: ['https']})}),
    defineField({name: 'noIndex', title: 'Excluir de buscadores', type: 'boolean', initialValue: false}),
  ],
})

export const link = defineType({
  name: 'link', title: 'Enlace / botón', type: 'object', icon: LinkIcon,
  fields: [
    defineField({name: 'label', title: 'Texto', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', title: 'Destino', type: 'string', description: 'Ruta /zonas, https://, tel: o mailto:', validation: (r) => r.required().custom((v) => !v || /^(\/(?!\/)|https:\/\/|tel:\+?[\d-]+$|mailto:)/.test(v) || 'Usa una ruta interna o URL segura')}),
  ],
})

export const richText = defineType({
  name: 'richText', title: 'Contenido', type: 'array',
  of: [defineArrayMember({type: 'block'}), defineArrayMember({type: 'editorialImage'})],
})
