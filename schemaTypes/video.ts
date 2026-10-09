import {defineType, defineField} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'
import {YouTubeInput} from '../sanity/components/YouTubeInput'
import {titleField, slugField, seoField, demoField, sourceField, refs} from './shared'
export const video = defineType({
  name: 'video', title: 'Video', type: 'document', icon: PlayIcon,
  fields: [{...titleField, validation:undefined, description:'Opcional: sustituye el título de YouTube.'}, {...slugField, validation:undefined},
    defineField({name: 'summary', title: 'Resumen', type: 'text'}),
    defineField({name: 'youtubeUrl', title: 'Video de YouTube', type: 'url', components:{input:YouTubeInput}, description: 'Selecciona un video público de @vivetucson.', validation: (r) => r.custom((value, context) => {
      if (!value) return context.document?.isDemo ? true : 'Añade un video real de YouTube'
      try {const url = new URL(value); return (url.protocol === 'https:' && ['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) || 'Usa una URL HTTPS de YouTube'} catch {return 'URL inválida'}
    })}),
    defineField({name: 'thumbnail', title: 'Miniatura', type: 'editorialImage'}),
    defineField({name:'featured',title:'Destacar en inicio',type:'boolean',initialValue:false}),
    defineField({name:'sortOrder',title:'Orden editorial',type:'number',description:'Menor número aparece primero.',validation:r=>r.integer().min(0)}),
    defineField({name:'hiddenFromSite',title:'Ocultar en la web',type:'boolean',initialValue:false}),
    defineField({name:'categories',title:'Categorías',type:'array',of:[{type:'string'}],options:{layout:'tags'},validation:r=>r.unique()}),
    defineField({name:'disableAutoAssociation',title:'Usar solamente mis zonas y categorías',type:'boolean',initialValue:false,description:'Desactiva las asociaciones automáticas por palabras del título.'}),
    defineField({name: 'publishedAt', title: 'Fecha', type: 'datetime'}),
    defineField({name: 'transcript', title: 'Transcripción', type: 'richText'}), refs('areas', 'Zonas', 'area'), seoField, demoField, sourceField,
  ],
  preview:{select:{title:'title',subtitle:'youtubeUrl',media:'thumbnail'},prepare:({title,subtitle,media})=>({title:title||'Video de YouTube',subtitle,media})},
})
