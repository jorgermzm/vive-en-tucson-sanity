'use client'

import '@sanity/ui/styles.css'
import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {apiVersion,dataset,projectId,studioUrl} from './sanity/lib/api'
import * as resolve from './sanity/presentation/resolve'

const singletons = new Set(['siteSettings','homepage'])

export default defineConfig({
  name:'default',
  title:'Vive en Tucson',
  basePath:studioUrl,
  projectId,
  dataset,
  plugins:[
    presentationTool({resolve,previewUrl:{previewMode:{enable:'/api/draft-mode/enable'}}}),
    structureTool({structure}),
    visionTool({defaultApiVersion:apiVersion}),
  ],
  schema:{
    types:schemaTypes,
    templates:(templates)=>templates.filter((t)=>!singletons.has(t.schemaType)),
  },
  document:{
    actions:(actions,context)=>singletons.has(context.schemaType)
      ? actions.filter(({action})=>action && ['publish','discardChanges','restore'].includes(action))
      : actions,
  },
})
