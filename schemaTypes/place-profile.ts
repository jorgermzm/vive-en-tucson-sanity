import {defineField, defineType} from 'sanity'
import {PLACE_CATEGORIES} from '../lib/place-categories'

export const placeProfile = defineType({
  name: 'placeProfile', title: 'Ficha de lugar', type: 'document',
  description: 'Añade tu historia y recomendación a un lugar de Google. Los datos de Google se consultan automáticamente y no se guardan aquí.',
  fields: [
    defineField({name: 'title', title: 'Nombre interno', type: 'string', validation: r => r.required()}),
    defineField({name: 'placeId', title: 'Google Place ID', type: 'string', validation: r => r.required().regex(/^[A-Za-z0-9_-]{1,200}$/).custom(async (value, context) => {
      if (!value) return true
      const id = context.document?._id?.replace(/^drafts\./, '') || ''
      const count = await context.getClient({apiVersion: '2026-10-03'}).fetch<number>('count(*[_type == "placeProfile" && placeId == $placeId && !(_id in [$id, $draft])])', {placeId: value, id, draft: `drafts.${id}`})
      return count === 0 || 'Ya existe una ficha editorial para este lugar.'
    })}),
    defineField({name: 'category', title: 'Categoría', type: 'string', options: {list: Object.entries(PLACE_CATEGORIES).map(([value, c]) => ({title: c.label, value}))}}),
    defineField({name: 'story', title: 'Historia e información verificada', type: 'text', rows: 6, description: 'Texto editorial propio y comprobado. No copies reseñas ni descripciones de Google.'}),
    defineField({name: 'recommendation', title: 'La selección de Jorge', type: 'text', rows: 4, description: 'Tu experiencia y lo que recomiendas probar o hacer. Se muestra solamente al publicarla.'}),
    defineField({name: 'videos', title: 'Videos de Jorge sobre este lugar', type: 'array', of: [{type: 'reference', to: [{type: 'video'}]}], validation: r => r.unique().max(3)}),
    defineField({name: 'relatedPlaceIds', title: 'Otros 4 lugares relacionados (Place IDs)', type: 'array', of: [{type: 'string', validation: r => r.regex(/^[A-Za-z0-9_-]{1,200}$/)}], validation: r => r.unique().max(4)}),
  ],
  preview: {select: {title: 'title', subtitle: 'placeId'}},
})
