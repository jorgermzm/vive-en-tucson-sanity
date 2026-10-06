import {defineField, defineType, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {seoField, demoField} from './shared'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'title', title: 'Nombre del sitio', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', title: 'Lema', type: 'string'}),
    defineField({name: 'agentName', title: 'Nombre del asesor', type: 'string'}),
    defineField({
      name: 'agentPhoto',
      title: 'Foto de Jorge / agente',
      type: 'editorialImage',
      description: 'Arrastra y suelta aquí la fotografía que quieres usar en la presentación del sitio.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'editorialImage',
      description: 'Arrastra y suelta tu logo. Si queda vacío, se mostrará el nombre del sitio en texto.',
    }),
    defineField({name: 'phone', title: 'Teléfono', type: 'string'}),
    defineField({name: 'email', title: 'Correo', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'whatsappUrl', title: 'WhatsApp', type: 'url', validation: (r) => r.uri({scheme: ['https']})}),
    defineField({name: 'siteUrl', title: 'URL pública del sitio', type: 'url'}),
    defineField({name: 'navigation', title: 'Navegación', type: 'array', of: [defineArrayMember({type: 'link'})]}),
    defineField({name: 'socialLinks', title: 'Redes sociales', type: 'array', of: [defineArrayMember({type: 'link'})]}),
    defineField({name: 'footerText', title: 'Texto del pie', type: 'text'}),
    seoField,
    demoField,
  ],
})
