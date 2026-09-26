import {defineField, defineArrayMember} from 'sanity'
export const titleField = defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()})
export const slugField = defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (r) => r.required()})
export const seoField = defineField({name: 'seo', title: 'SEO', type: 'seo'})
export const demoField = defineField({name: 'isDemo', title: 'Contenido de prueba', type: 'boolean', initialValue: false, description: 'El frontend debe excluirlo al lanzar el sitio.'})
export const sourceField = defineField({name: 'seedKey', title: 'Identificador de importación', type: 'string', readOnly: true, hidden: ({value}) => !value})
export const refs = (name: string, title: string, type: string) => defineField({name, title, type: 'array', of: [defineArrayMember({type: 'reference', to: [{type}]})], validation: (r) => r.unique()})
