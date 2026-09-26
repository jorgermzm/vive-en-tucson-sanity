import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {titleField, slugField, seoField, demoField, sourceField, refs} from './shared'
export const area = defineType({
  name: 'area', title: 'Zona', type: 'document', icon: DocumentIcon,
  fields: [titleField, slugField,
    defineField({name: 'summary', title: 'Resumen', type: 'text', rows: 3, validation: (r) => r.required().max(300)}),
    defineField({name: 'description', title: 'Descripción', type: 'richText'}),
    defineField({name: 'mainImage', title: 'Imagen principal', type: 'editorialImage'}),
    defineField({name: 'gallery', title: 'Galería', type: 'array', of: [defineArrayMember({type: 'editorialImage'})]}),
    defineField({name: 'highlights', title: 'Puntos de interés', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'housingTypes', title: 'Tipos de vivienda', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'location', title: 'Ubicación orientativa', type: 'geopoint'}),
    defineField({name: 'sortOrder', title: 'Orden', type: 'number', validation: (r) => r.integer().min(0)}),
    refs('relatedVideos', 'Videos relacionados', 'video'),
    defineField({name: 'contactAction', title: 'Contacto', type: 'link'}), seoField, demoField, sourceField,
  ],
  preview: {select: {title: 'title', subtitle: 'summary', media: 'mainImage'}},
  orderings: [{title: 'Orden editorial', name: 'editorialOrder', by: [{field: 'sortOrder', direction: 'asc'}]}],
})
