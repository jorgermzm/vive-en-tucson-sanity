import {defineCliConfig} from 'sanity/cli'
export default defineCliConfig({
  api:{
    projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qpdnewuy',
    dataset:process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
  typegen:{path:'./sanity/lib/queries.ts',schema:'./schema.json',generates:'./sanity.types.ts'},
})
