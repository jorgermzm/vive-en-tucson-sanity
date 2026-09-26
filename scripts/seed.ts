import {getCliClient} from 'sanity/cli'
import {readFile} from 'node:fs/promises'
import type {SanityDocument} from '@sanity/client'

// Restore only missing demo documents, never replace editorial changes.
// IDs are the actual IDs assigned by Sanity during the initial MCP import.
const client = getCliClient({apiVersion: '2026-09-25'}).withConfig({useCdn: false, perspective: 'raw'})
if (client.config().projectId !== 'qpdnewuy' || client.config().dataset !== 'production') {
  throw new Error('Este seed está limitado a qpdnewuy / production')
}
const docs = JSON.parse((await readFile(new URL('../seed/demo.json', import.meta.url), 'utf8')).replace(/^\uFEFF/, '')) as SanityDocument[]
let transaction = client.transaction()
let count = 0
for (const doc of docs) {
  const existing = await client.fetch<number>(
    'count(*[_id in $ids || (defined($seedKey) && seedKey == $seedKey)])',
    {ids: [doc._id, 'drafts.' + doc._id], seedKey: doc.seedKey ?? null},
  )
  if (existing) continue
  transaction = transaction.createIfNotExists(doc)
  count++
}
if (count) await transaction.commit()
console.log(`Creados ${count} documentos; los existentes se conservaron.`)
