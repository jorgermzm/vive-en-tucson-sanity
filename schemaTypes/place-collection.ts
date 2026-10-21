import {defineField, defineType} from 'sanity'
import {PLACE_CATEGORIES} from '../lib/place-categories'

const placeIds = (name: string, title: string) => defineField({
  name, title, type: 'array', of: [{type: 'string', validation: r => r.regex(/^[A-Za-z0-9_-]{1,200}$/, {name: 'ID de Google Places'})}],
  validation: r => r.unique().max(12),
})
export const placeCollection = defineType({
  name: 'placeCollection', title: 'Selección de lugares', type: 'document',
  description: 'Opcional: elige qué lugares aparecen. Los nombres, direcciones y fotos se consultan desde Google al abrir la página.',
  fields: [
    defineField({name: 'title', title: 'Nombre interno', type: 'string', validation: r => r.required()}),
    defineField({name: 'category', title: 'Sección', type: 'string', options: {list: Object.entries(PLACE_CATEGORIES).map(([value, c]) => ({title: c.label, value}))}, validation: r => r.required().custom(async (value, context) => {
      if (!value) return true
      const id = context.document?._id?.replace(/^drafts\./, '')
      const count = await context.getClient({apiVersion: '2026-10-03'}).fetch<number>('count(*[_type == "placeCollection" && category == $category && !(_id in [$id, $draft])])', {category: value, id: id || '', draft: `drafts.${id}`})
      return count === 0 || 'Ya existe una selección para esta sección.'
    })}),
    {...placeIds('placeIds', 'Lugares seleccionados (Place IDs)'), description: 'Déjalo vacío para descubrir lugares automáticamente. Con IDs, se mostrarán estos lugares en el orden elegido.'},
    {...placeIds('hiddenPlaceIds', 'Lugares que no quieres mostrar (Place IDs)'), description: 'Se excluyen de los resultados automáticos.'},
  ],
  preview: {select: {title: 'title', subtitle: 'category'}},
})
