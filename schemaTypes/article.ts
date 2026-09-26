import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {titleField, slugField, seoField, demoField, sourceField, refs} from './shared'
export const article = defineType({
  name: 'article', title: 'Artículo', type: 'document', icon: DocumentTextIcon,
  fields: [titleField, slugField,
    defineField({name: 'excerpt', title: 'Extracto', type: 'text', validation: (r) => r.max(300)}),
    defineField({name: 'body', title: 'Contenido', type: 'richText', validation: (r) => r.required()}),
    defineField({name: 'mainImage', title: 'Imagen', type: 'editorialImage'}),
    defineField({name: 'authorName', title: 'Autor', type: 'string'}),
    defineField({name: 'publishedAt', title: 'Fecha', type: 'datetime'}), refs('areas', 'Zonas relacionadas', 'area'), seoField, demoField, sourceField,
  ],
})
