import {defineType, defineField} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {titleField, slugField, seoField, demoField, sourceField, refs} from './shared'
export const video = defineType({
  name: 'video', title: 'Video', type: 'document', icon: PlayIcon,
  fields: [titleField, slugField,
    defineField({name: 'summary', title: 'Resumen', type: 'text'}),
    defineField({name: 'youtubeUrl', title: 'URL de YouTube', type: 'url', description: 'Vacío en ejemplos sin video real.', validation: (r) => r.custom((value, context) => {
      if (!value) return context.document?.isDemo ? true : 'Añade un video real de YouTube'
      try {const url = new URL(value); return (url.protocol === 'https:' && ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) || 'Usa una URL HTTPS de YouTube'} catch {return 'URL inválida'}
    })}),
    defineField({name: 'thumbnail', title: 'Miniatura', type: 'editorialImage'}),
    defineField({name: 'publishedAt', title: 'Fecha', type: 'datetime'}),
    defineField({name: 'transcript', title: 'Transcripción', type: 'richText'}), refs('areas', 'Zonas', 'area'), seoField, demoField, sourceField,
  ],
})
