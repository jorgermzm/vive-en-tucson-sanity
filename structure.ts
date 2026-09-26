import type {StructureResolver} from 'sanity/structure'
export const structure: StructureResolver = (S) => S.list().title('Vive en Tucson').items([
  S.listItem().title('Configuración del sitio').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  S.listItem().title('Página de inicio').child(S.document().schemaType('homepage').documentId('homepage')),
  S.divider(),
  ...S.documentTypeListItems().filter((item) => !['siteSettings', 'homepage'].includes(item.getId() || '')),
])
