import Image from 'next/image'
import Link from 'next/link'
import {HOME_QUERY} from '@/sanity/lib/queries'
import {getSanityFetchOptions, sanityFetch} from '@/sanity/lib/live'
import {urlFor} from '@/sanity/lib/image'
import {getSiteVideos} from '@/lib/videos'
import {durationLabel} from '@/lib/youtube-data'
import {CHANNEL_URL} from '@/lib/youtube'
import {SiteIcon, type IconName} from '@/app/components/SiteIcon'
import {ContactForm} from '@/app/components/ContactForm'
import {ProfileFacts} from '@/app/components/ProfileFacts'

export const revalidate = 3600

type CmsImage = {asset?: unknown; alt?: string | null; crop?: unknown; hotspot?: unknown}
type Area = {_id?: string; _key?: string; title?: string | null; slug?: string | null; summary?: string | null; mainImage?: CmsImage | null}
type Inspiration = {_key: string; title?: string | null; subtitle?: string | null; href?: string | null; image?: CmsImage | null}
type HomeData = {
  settings?: {agentBio?: string | null; agentName?: string | null; phone?: string | null; whatsappUrl?: string | null; logo?: CmsImage | null; agentPhoto?: CmsImage | null; areasServed?: string | null; languages?: string | null; specialties?: string | null; responseTime?: string | null} | null;
  home?: {heroDescription?: string | null; heroImage?: CmsImage | null; inspirationItems?: Inspiration[] | null; featuredAreas?: Area[] | null; propertyShowcase?: {_key: string; location?: string | null; propertyType?: string | null; image?: CmsImage | null}[] | null; storyCards?: {_key: string; title?: string | null; tag?: string | null; href?: string | null; image?: CmsImage | null}[] | null} | null
}
const categories: {title: string; match: string[]; description: string; icon: IconName; href: string}[] = [
  {title: 'Restaurantes', match: ['restaurantes'], description: 'Sabores sonorenses, tacos icónicos y lugares para disfrutar la gastronomía local.', icon: 'food', href: '/restaurantes'},
  {title: 'Hiking y Outdoors', match: ['hiking y outdoors', 'hiking'], description: 'Senderos, paisajes del desierto y aventuras al aire libre.', icon: 'mountain', href: '/zonas'},
  {title: 'Museos', match: ['museos'], description: 'Arte, historia y cultura para descubrir otra cara de Tucson.', icon: 'museum', href: '/que-hacer'},
  {title: 'Bares y vida nocturna', match: ['nightlife', 'bares', 'vida nocturna', 'bares y vida nocturna'], description: 'Bares con ambiente, música y planes para disfrutar la noche.', icon: 'night', href: '/vida-nocturna'},
  {title: 'Eventos', match: ['eventos'], description: 'Descubre la ciudad, sus encuentros y sus historias a través de nuestros videos.', icon: 'calendar', href: '/videos?categoria=Eventos'},
  {title: 'Shopping', match: ['shopping'], description: 'Tiendas, mercados y rincones para explorar los barrios de Tucson.', icon: 'bag', href: '/zonas'},
]
function imageUrl(image: CmsImage | null | undefined, width = 1600, height = 1000) {
  if (!image?.asset) return null
  try { return urlFor(image).width(width).height(height).fit('crop').url() } catch { return null }
}
function EditorialImage({value, alt, sizes, priority = false}: {value?: CmsImage | null; alt: string; sizes: string; priority?: boolean}) {
  const src = imageUrl(value)
  return src ? <Image src={src} alt={value?.alt || alt} fill sizes={sizes} priority={priority} className="object-cover"/> : <div className="vet-image-fallback" aria-hidden="true"><SiteIcon name="mountain" width={56} height={56}/></div>
}
function SectionTitle({eyebrow, title, children}: {eyebrow: string; title: string; children?: React.ReactNode}) {
  return <div className="vet-section-title"><p className="vet-eyebrow">{eyebrow}</p><h2>{title}</h2><span className="vet-rule"/>{children && <p className="vet-section-description">{children}</p>}</div>
}

export default async function HomePage() {
  const videoPromise = getSiteVideos()
  const options = await getSanityFetchOptions()
  const [{data}, {videos}] = await Promise.all([sanityFetch({query: HOME_QUERY, ...options}), videoPromise])
  const content = data as HomeData | null
  const settings = content?.settings
  const home = content?.home
  const phone = settings?.phone || '520-335-9349'
  const whatsapp = settings?.whatsappUrl || 'https://wa.me/15203359349'
  const logoUrl = imageUrl(settings?.logo, 120, 120)
  const areas = (home?.featuredAreas || []).filter(area => area?.slug).slice(0, 4)
  const featured = videos.find(video => video.featured) || [...videos].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  const moreVideos = videos.filter(video => video.id !== featured?.id).slice(0, 3)
  const stories = (home?.storyCards || []).slice(0, 3)
  const properties = (home?.propertyShowcase || []).slice(0, 2)

  return <div className="vet-site">
    <a href="#contenido" className="vet-skip-link">Saltar al contenido</a>
    <main id="contenido">
      <section id="inicio" className="vet-hero">
        <div className="vet-hero-image"><EditorialImage value={home?.heroImage} alt="Paisaje de Tucson, Arizona" sizes="100vw" priority/></div>
        <div className="vet-hero-overlay"/>
        <div className="vet-hero-corners shell">
          <div className="vet-hero-brand">{logoUrl && <span className="relative h-8 w-8 overflow-hidden rounded-full"><Image src={logoUrl} alt="" fill sizes="32px" className="object-cover"/></span>}<span>Vive en Tucson | Con Jorge</span></div>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="vet-hero-contact"><span className="vet-chat-mark"><SiteIcon name="chat"/></span><span><small>Escríbeme hoy</small><strong>{phone}</strong></span></a>
        </div>
        <div className="vet-hero-content shell">
          <p className="vet-hero-kicker">Arizona Lifestyle &amp; Real Estate</p>
          <h1>Descubre Tucson<br/><span>como alguien que vive aquí</span></h1>
          <p className="vet-hero-description">{home?.heroDescription || 'Explora los mejores rincones de la ciudad, guías locales y encuentra tu próximo hogar de la mano de Jorge.'}</p>
          <div className="vet-hero-buttons"><Link href="/videos" className="vet-button vet-button-gold"><SiteIcon name="play"/>VIDEOS</Link><Link href="/comprar" className="vet-button vet-button-outline"><SiteIcon name="home"/>Buscar casas en Tucson</Link></div>
        </div>
      </section>

      <section id="inspirate" className="vet-section shell">
        <SectionTitle eyebrow="Estilo de vida local" title="Inspírate en Tucson">Todo lo que necesitas para disfrutar la ciudad, organizado por categorías.</SectionTitle>
        <div className="vet-category-grid">{categories.map(category => {
          const item = home?.inspirationItems?.find(item => category.match.includes((item.title || '').trim().toLowerCase()))
          return <Link key={category.title} href={category.href} prefetch={false} className="vet-category-card">
            <EditorialImage value={item?.image} alt={category.title} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"/>
            <span className="vet-card-shade"/>
            <div className="vet-category-copy"><span className="vet-category-icon"><SiteIcon name={category.icon} width={26} height={26}/></span><h3>{category.title}</h3><p>{category.description}</p></div>
          </Link>
        })}</div>
      </section>

      <section id="vivir" className="vet-zones vet-section">
        <div className="shell" id="zonas"><SectionTitle eyebrow="Ubicaciones clave" title="Explora Tucson por Zona">Cada zona tiene su propia personalidad. Conoce el entorno y encuentra el lugar que va contigo.</SectionTitle>
          <div className="vet-zone-grid">{areas.map(area => <article key={area._id || area._key || area.slug} className="vet-zone-card">
            <Link href={`/zonas/${area.slug}`} className="vet-zone-image"><EditorialImage value={area.mainImage} alt={area.title || 'Zona de Tucson'} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"/></Link>
            <div className="vet-zone-copy"><h3><Link href={`/zonas/${area.slug}`}>{area.title}</Link></h3><p>{area.summary}</p><Link href={`/zonas/${area.slug}`} className="vet-text-link">Conocer la zona <SiteIcon name="arrow" width={17} height={17}/></Link></div>
          </article>)}</div>
          <div className="mt-10 text-center"><Link href="/zonas" className="vet-button vet-button-outline">Ver todas las zonas <SiteIcon name="arrow" width={18} height={18}/></Link></div>
        </div>
      </section>

      <section id="video-del-mes" className="vet-section shell">
        <SectionTitle eyebrow="Destacado de YouTube" title="El Video del Mes"/>
        <div className="vet-feature-grid">
          <div>{featured ? <>
            <a href={featured.youtubeUrl} className="vet-feature-image" aria-label={`Ver ${featured.title} en YouTube`}><Image src={featured.thumbnailUrl} alt={featured.thumbnailAlt} fill sizes="(max-width:1024px) 100vw,65vw" className="object-cover"/><span className="vet-video-shade"/><span className="vet-play-button"><SiteIcon name="play" width={30} height={30}/></span><span className="vet-feature-badge">VIVE TUCSON · YOUTUBE</span>{durationLabel(featured.duration) && <span className="vet-duration">{durationLabel(featured.duration)}</span>}</a>
            <div className="vet-feature-description">{featured.areas[0] && <p className="vet-eyebrow flex items-center gap-2"><SiteIcon name="pin" width={16} height={16}/>{featured.areas[0].title}</p>}<h3>{featured.title}</h3><p className="vet-video-description">{featured.description}</p><a href={featured.youtubeUrl} className="vet-text-link">Ver video completo en YouTube <SiteIcon name="arrow" width={18} height={18}/></a></div>
          </> : <div className="vet-video-empty"><SiteIcon name="video" width={54} height={54}/><h3>Descubre Tucson en video</h3><p>Recorridos, zonas y vida local con Jorge.</p><a href={CHANNEL_URL} className="vet-button vet-button-gold">Ver Vive Tucson en YouTube</a></div>}</div>
          <aside id="comprar" className="vet-property-panel"><p className="vet-eyebrow">Asesoría inmobiliaria</p><h3>Tu próximo hogar<br/>en Tucson</h3><p className="vet-property-intro">Conoce las zonas y conversemos sobre las opciones que se ajustan a lo que buscas.</p>
            <div className="vet-property-list">{properties.map(property => <div key={property._key} className="vet-property-preview"><div className="vet-property-image"><EditorialImage value={property.image} alt={property.image?.alt || 'Referencia del entorno residencial'} sizes="180px"/></div><div><p className="vet-property-location">{property.location || 'Tucson, Arizona'}</p><h4>{property.propertyType || 'Conoce tus opciones'}</h4><a href={whatsapp} className="vet-text-link text-xs">Consultar con Jorge <SiteIcon name="arrow" width={15} height={15}/></a></div></div>)}</div>
            {properties.length > 0 && <p className="mt-4 text-xs leading-5 text-slate-500">Imágenes de referencia del entorno. Consulta disponibilidad y precios actuales con Jorge.</p>}
            <a href={whatsapp} className="vet-button vet-button-green mt-6 w-full"><SiteIcon name="chat"/>Hablemos de tu búsqueda</a>
          </aside>
        </div>
      </section>

      <section id="videos" className="vet-section vet-more-videos shell">
        <div className="vet-section-heading-row"><div><p className="vet-eyebrow">Canal YouTube</p><h2>Más Videos de Vive Tucson</h2></div><a href={CHANNEL_URL} className="vet-text-link">Ver canal completo <SiteIcon name="arrow" width={18} height={18}/></a></div>
        {moreVideos.length > 0 ? <div className="vet-video-grid">{moreVideos.map(video => <article key={video.id} className="vet-video-card"><a href={video.youtubeUrl} className="vet-video-thumb" aria-label={`Ver ${video.title} en YouTube`}><Image src={video.thumbnailUrl} alt={video.thumbnailAlt} fill sizes="(max-width:640px) 100vw,33vw" className="object-cover"/><span className="vet-play-button vet-play-small"><SiteIcon name="play"/></span></a><div className="p-6"><p className="vet-eyebrow">{video.categories[0] || 'Recorridos de Tucson'}</p><h3><a href={video.youtubeUrl}>{video.title}</a></h3></div></article>)}</div> : <a href={CHANNEL_URL} className="vet-button vet-button-gold mt-8">Explorar el canal de YouTube</a>}
      </section>

      {stories.length > 0 && <section id="guias" className="vet-section vet-guides shell"><SectionTitle eyebrow="Historias y consejos" title="Tu guía para vivir Tucson"/><div className="vet-video-grid">{stories.map(story => <Link href={story.href || '/videos'} key={story._key} className="vet-video-card"><div className="vet-video-thumb"><EditorialImage value={story.image} alt={story.title || 'Guía de Tucson'} sizes="(max-width:640px) 100vw,33vw"/></div><div className="p-6"><p className="vet-eyebrow">{story.tag || 'Vive en Tucson'}</p><h3>{story.title}</h3></div></Link>)}</div></section>}

      <section id="sobre-jorge" className="vet-about vet-section"><div className="shell vet-about-grid">
        <div className="vet-about-copy"><p className="vet-eyebrow">Tu guía local y realtor</p><h2>Hola, soy Jorge</h2><span className="vet-rule"/><p className="vet-about-bio">{settings?.agentBio || 'Te acompaño a conocer Tucson y a encontrar el lugar que va contigo. Conversemos sobre tus planes y tu próximo paso.'}</p><ProfileFacts settings={settings}/><a href={whatsapp} className="vet-button vet-button-green mt-8"><SiteIcon name="chat"/>Escríbeme por WhatsApp</a></div>
        <div id="contacto"><ContactForm/></div>
      </div></section>
    </main>
  </div>
}
