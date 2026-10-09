const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const {stripTypeScriptTypes}=require('node:module')
require.extensions['.ts']=(module,filename)=>{
  let source=stripTypeScriptTypes(fs.readFileSync(filename,'utf8'))
  const names=[...source.matchAll(/export (?:async )?function (\w+)/g)].map(match=>match[1])
  source=source.replace(/import \{([^}]+)\} from '([^']+)'/g,(_,names,path)=>`const {${names}}=require('${path}.ts')`).replace(/export /g,'')
  module._compile(source+'\nmodule.exports={'+names.join(',')+'}',filename)
}
const {fetchChannelCatalog}=require('../lib/youtube-client.ts')
const {videoId,durationLabel,normalizeVideo}=require('../lib/youtube-data.ts')
const item=(id='abcdefghijk',channelId='confirmed-channel',privacyStatus='public')=>({id,snippet:{channelId,title:'Oro Valley',description:'Recorrido',publishedAt:'2026-10-01T12:00:00Z',thumbnails:{high:{url:'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg'}}},status:{privacyStatus,uploadStatus:'processed'},contentDetails:{duration:'PT1H2M3S'}})
test('only recognizes genuine HTTPS YouTube video URLs',()=>{
  for(const url of ['https://youtu.be/abcdefghijk','https://www.youtube.com/watch?v=abcdefghijk&x=1','https://youtube.com/shorts/abcdefghijk'])assert.equal(videoId(url),'abcdefghijk')
  for(const url of ['https://youtube.com.evil.test/watch?v=abcdefghijk','javascript:alert(1)','https://youtube.com/watch?v=bad','http://youtu.be/abcdefghijk'])assert.equal(videoId(url),null)
})
test('formats ISO durations',()=>{assert.equal(durationLabel('PT1H2M3S'),'1:02:03');assert.equal(durationLabel('PT2M'),'2:00');assert.equal(durationLabel('P0D'),'')})
test('excludes private, unlisted, deleted and wrong-channel videos',()=>{
  assert.ok(normalizeVideo(item(),'confirmed-channel'))
  for(const state of ['private','unlisted'])assert.equal(normalizeVideo(item(undefined,undefined,state),'confirmed-channel'),null)
  assert.equal(normalizeVideo(item(undefined,'other-channel'),'confirmed-channel'),null)
  assert.equal(normalizeVideo({id:'abcdefghijk'},'confirmed-channel'),null)
})
test('resolves confirmed handle, follows uploads pagination, batches details and deduplicates',async()=>{
  const calls=[]
  const fetcher=async(url,options)=>{
    const u=new URL(url);calls.push(u)
    assert.equal(options.headers['X-Goog-Api-Key'],'test-placeholder')
    assert.equal(u.searchParams.has('key'),false)
    if(u.pathname.endsWith('/channels')){assert.equal(u.searchParams.get('forHandle'),'@vivetucson');return Response.json({items:[{id:'confirmed-channel',contentDetails:{relatedPlaylists:{uploads:'uploads-playlist'}}}]})}
    if(u.pathname.endsWith('/playlistItems')){assert.equal(u.searchParams.get('playlistId'),'uploads-playlist');return Response.json({items:[{contentDetails:{videoId:'abcdefghijk'}}],...(!u.searchParams.has('pageToken')?{nextPageToken:'page-2'}:{})})}
    assert.ok(u.pathname.endsWith('/videos'))
    return Response.json({items:[item(),item('zyxwvutsrqp','other-channel')]})
  }
  const result=await fetchChannelCatalog('test-placeholder',fetcher)
  assert.equal(calls.length,5);assert.equal(result.videos.length,1);assert.equal(result.videos[0].duration,'PT1H2M3S')
})
test('quota and permission errors fail without leaking response bodies or keys',async()=>{
  await assert.rejects(fetchChannelCatalog('test-placeholder',async()=>new Response('sensitive upstream details',{status:403})),{message:'YouTube request failed (403)'})
})
test('invalid response or missing channel fails clearly',async()=>{
  await assert.rejects(fetchChannelCatalog('test-placeholder',async()=>Response.json({})),/Invalid YouTube response/)
  await assert.rejects(fetchChannelCatalog('test-placeholder',async()=>Response.json({items:[]})),/channel unavailable/)
})
test('network failure propagates to the server fallback',async()=>{
  await assert.rejects(fetchChannelCatalog('test-placeholder',async()=>{throw new Error('network failure')}),/network failure/)
})
