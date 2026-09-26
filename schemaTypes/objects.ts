import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {ImageIcon} from '@sanity/icons/Image'
import {LinkIcon} from '@sanity/icons/Link'

export const editorialImage = defineType({
  name: 'editorialImage', title: 'Imagen', type: 'image', icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Texto alternativo', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'caption', title: 'Pie de imagen', type: 'string'}),
    defineField({name: 'credit', title: 'Crédito', type: 'string'}),
  ],
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
