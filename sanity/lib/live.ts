import {defineLive} from 'next-sanity/live'
import {draftMode} from 'next/headers'
import {client} from './client'
import {token} from './token'

export const {sanityFetch,SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

export async function getSanityFetchOptions() {
  const {isEnabled} = await draftMode()
  return isEnabled
    ? ({perspective:'drafts',stega:true} as const)
    : ({perspective:'published',stega:false} as const)
}
