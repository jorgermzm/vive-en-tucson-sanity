# YouTube: Vive Tucson

Channel confirmed by Jorge: https://www.youtube.com/@vivetucson.
The API resolves this handle to its exact channel ID and uploads playlist. No channel is guessed from a name.

## Activation

Enable YouTube Data API v3 in Google Cloud. Restrict an API key to this API and save it as the server-only `YOUTUBE_API_KEY` Secret in Production and Preview for Vercel team `vive-tucson`, project `vive-en-tucson-sanity`. Do not use NEXT_PUBLIC_, source control or chat for this value. Redeploy after setting it. Browser referrer restrictions do not work for server requests.

## Editorial workflow

Videos appear automatically without creating Sanity documents. For an override, open Studio → Video → create a document. Select a video from the channel dropdown (or paste its URL). Title and slug are optional. Set a custom title/summary/thumbnail, categories, area references, featured flag, order, or hide flag and publish. YouTube supplies any omitted metadata. Existing images, crop and hotspot fields remain editable. Dates/durations always come from YouTube.

Homepage → featured videos retains priority in its specified order; the featured flag is the next choice, then the latest available upload. Area → related videos and Video → areas both establish explicit relationships. Conservative title matching adds categories/areas; disable automatic association per video when editorial control is preferred. Hidden, unlisted/private, deleted, other-channel and demo entries do not render. Duplicate editorial documents for one URL use the most recently updated record.

## Cache and failure behavior

The server caches a complete successful catalog for one hour and revalidates on demand. It fetches up to the latest 500 uploads (10 pages, 50 each), using channels.list → playlistItems.list → videos.list, never search.list. Each full refresh costs at most 21 units. A failed refresh does not overwrite a good cache. Cached results older than 24 hours are withheld. Without a key or usable catalog, /videos links to the channel; the homepage keeps its existing area fallback. No writes or credentials for Sanity are required to fetch videos.

The Studio dropdown uses GET /api/youtube, which only exposes public titles/IDs/URLs and a connection status. It never returns the key or upstream error details. Public pages render on the server, with responsive cards, dates, durations, filters and escaped VideoObject JSON-LD.

## Verification

Run `node --test tests/youtube.test.cjs`, `npm run type-check`, and `npm run build`. Test /api/youtube (status ready and nonempty videos), /videos, a video link, homepage, a related area, and Studio selection on the deployed site after activation. Confirm one editorial override and hiding from Studio. No live YouTube request can succeed before the key is provisioned.

References: https://developers.google.com/youtube/v3/docs/channels/list · https://developers.google.com/youtube/v3/docs/playlistItems/list · https://developers.google.com/youtube/v3/docs/videos/list
