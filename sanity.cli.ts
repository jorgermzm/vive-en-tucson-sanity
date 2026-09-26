import {defineCliConfig} from 'sanity/cli'
export default defineCliConfig({
  api: {projectId: 'qpdnewuy', dataset: 'production'},
  typegen: {path: './lib/queries.ts', schema: './schema.json', generates: './sanity.types.ts'},
})
