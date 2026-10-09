import {defineQuery} from 'next-sanity'

export const HOME_QUERY = defineQuery(`
{
  "settings": *[_id == "siteSettings"][0]{
    _id,_type,title,tagline,agentName,agentBio,areasServed,languages,specialties,responseTime,phone,email,whatsappUrl,siteUrl,
    logo{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
    agentPhoto{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
    navigation[]{_key,label,href}
  },
  "home": *[_id == "homepage"][0]{
    _id,_type,title,heroTitle,heroSubtitle,heroDescription,
    heroImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
    heroActions[]{_key,label,href},
    inspirationItems[]{
      _key,title,subtitle,icon,href,
      image{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
    },
    contactHeading,contactAction{label,href},
    contactBackgroundImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
    aboutImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
    featuredAreas[]{
      _key,
      ...@->{
        _id,_type,title,"slug":slug.current,summary,housingTypes,highlights,sortOrder,
        mainImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
      }
    },
    featuredVideos[]{
      _key,
      ...@->{
        _id,_type,title,isDemo,"slug":slug.current,summary,youtubeUrl,
        thumbnail{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
      }
    },
    videoGallery[]{
      _key,asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot
    },
    propertyShowcase[]{
      _key,price,propertyType,bedrooms,bathrooms,size,location,
      image{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
    },
    storyCards[]{
      _key,title,tag,href,
      image{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
    },
    featuredArticles[]{
      _key,
      ...@->{
        _id,title,"slug":slug.current,excerpt,
        mainImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
      }
    }
  }
}
`)

export const AREAS_QUERY = defineQuery(`
*[_type == "area" && defined(slug.current)] | order(sortOrder asc,title asc)[0...50]{
  _id,_type,title,"slug":slug.current,summary,housingTypes,highlights,sortOrder,
  mainImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
}
`)

export const AREA_QUERY = defineQuery(`
*[_type == "area" && slug.current == $slug][0]{
  _id,_type,title,"slug":slug.current,summary,description,housingTypes,highlights,
  mainImage{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
  gallery[]{_key,asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot},
  relatedVideos[]->{
    _id,title,summary,youtubeUrl,
    thumbnail{asset->{_id,url,metadata{lqip,dimensions}},alt,crop,hotspot}
  }
}
`)
