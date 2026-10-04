import {defineQuery} from 'next-sanity'

export const HOME_QUERY = defineQuery(`
{
  "settings": *[_id == "siteSettings"][0]{
    _id,_type,title,tagline,agentName,phone,email,whatsappUrl,siteUrl,
    navigation[]{_key,label,href}
  },
  "home": *[_id == "homepage"][0]{
    _id,_type,title,heroTitle,heroSubtitle,heroDescription,heroImage,
    heroActions[]{_key,label,href},
    contactHeading,contactAction{label,href},
    featuredAreas[]{
      _key,
      ...@->{_id,_type,title,"slug":slug.current,summary,mainImage,housingTypes,highlights,sortOrder}
    },
    featuredVideos[]{
      _key,
      ...@->{_id,_type,title,"slug":slug.current,summary,youtubeUrl,thumbnail}
    }
  }
}
`)

export const AREAS_QUERY = defineQuery(`
*[_type == "area" && defined(slug.current)] | order(sortOrder asc,title asc)[0...50]{
  _id,_type,title,"slug":slug.current,summary,mainImage,housingTypes,highlights,sortOrder
}
`)

export const AREA_QUERY = defineQuery(`
*[_type == "area" && slug.current == $slug][0]{
  _id,_type,title,"slug":slug.current,summary,description,mainImage,gallery,
  housingTypes,highlights,relatedVideos[]->{_id,title,summary,youtubeUrl,thumbnail}
}
`)
