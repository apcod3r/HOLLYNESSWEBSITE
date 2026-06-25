import { Helmet } from 'react-helmet-async'

const SITE      = 'Hollyness & Respishers Co. Ltd'
const BASE_URL  = 'https://hollyrespishers.com'
const BASE_IMG  = `${BASE_URL}/Logo.png`
const BASE_DESC = "Tanzania's premier licensed debt recovery, public auctioneering and commission agent services. Professional, confidential and results-driven — nationwide coverage."

interface SEOProps {
  title?       : string
  description? : string
  path?        : string
  image?       : string
  type?        : string
  noindex?     : boolean
}

export default function SEO({ title, description, path = '/', image, type = 'website', noindex }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Debt Recovery & Auctioneering Tanzania`
  const desc      = description || BASE_DESC
  const url       = `${BASE_URL}${path}`
  const img       = image || BASE_IMG

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url"         content={url} />
      <meta property="og:image"       content={img} />
      <meta property="og:site_name"   content={SITE} />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={img} />
    </Helmet>
  )
}
