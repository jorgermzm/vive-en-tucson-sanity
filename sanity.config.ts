import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const singletons = new Set(['siteSettings', 'homepage'])
export default defineConfig({
  name: 'default', title: 'Vive en Tucson',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'qpdnewuy',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure}), visionTool({defaultApiVersion: '2026-09-25'})],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    actions: (actions, context) => singletons.has(context.schemaType)
      ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
      : actions,
  },
})
