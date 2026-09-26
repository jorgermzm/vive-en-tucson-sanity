import {createClient} from '@sanity/client'
export const client = createClient({
  projectId: 'qpdnewuy', dataset: 'production',
  apiVersion: '2026-09-25', useCdn: true, perspective: 'published',
})
