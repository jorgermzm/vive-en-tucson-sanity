import {VisualEditing} from 'next-sanity/visual-editing'
import {draftMode} from 'next/headers'
import {SanityLive} from '@/sanity/lib/live'

export default async function WebsiteLayout({children}:{children:React.ReactNode}) {
  const {isEnabled} = await draftMode()
  return <>{children}<SanityLive includeDrafts={isEnabled}/>{isEnabled && <VisualEditing/>}</>
}
