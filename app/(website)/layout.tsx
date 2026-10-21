import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {SanityLive} from '@/sanity/lib/live'
import {SiteHeader} from '@/app/components/SiteHeader'
import {SiteFooter} from '@/app/components/SiteFooter'
import {getSiteBrand} from '@/lib/site-brand'

export default async function WebsiteLayout({children}:{children:React.ReactNode}) {
  const [{isEnabled},brand] = await Promise.all([draftMode(),getSiteBrand()])
  return <><SiteHeader brand={brand}/>{children}<SiteFooter/><SanityLive includeDrafts={isEnabled}/>{isEnabled && <VisualEditing/>}</>
}
