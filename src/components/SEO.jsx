import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Instant Worker';
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dxdjlyq72/image/upload/v1786430441/InstantWorker_Logo_pljqcg.png';
const SITE_URL = 'https://www.instantworker.in';

export default function SEO({ title, description, path = '', image = DEFAULT_IMAGE, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Skilled work, just a tap away`;
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'Find skilled workers or your next job in minutes — zero commission, live tracking, verified profiles.'} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ''} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || ''} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}