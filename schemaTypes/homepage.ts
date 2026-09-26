import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'
import {titleField, seoField, demoField, refs} from './shared'
export const homepage = defineType({
  name: 'homepage', title: 'Página de inicio', type: 'document', icon: DocumentIcon,
  fields: [titleField,
    defineField({name: 'heroTitle', title: 'Título principal', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'heroSubtitle', title: 'Subtítulo', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Descripción', type: 'text'}),
    defineField({name: 'heroImage', title: 'Imagen principal', type: 'editorialImage'}),
    defineField({name: 'heroActions', title: 'Botones', type: 'array', of: [defineArrayMember({type: 'link'})], validation: (r) => r.max(2)}),
    refs('featuredAreas', 'Zonas destacadas', 'area'), refs('featuredVideos', 'Videos destacados', 'video'), refs('featuredArticles', 'Artículos destacados', 'article'),
    defineField({name: 'contactHeading', title: 'Título de contacto', type: 'string'}),
    defineField({name: 'contactAction', title: 'Botón de contacto', type: 'link'}), seoField, demoField,
  ],
})
