import { SITE_CONFIG } from './constants';
import { LEGAL_COMPANY } from './legal-company';
import { SITE_DESCRIPTION } from './seo';

const ORGANIZATION_ID = `${SITE_CONFIG.url}/#organization`;
const WEBSITE_ID = `${SITE_CONFIG.url}/#website`;
const LOGO_URL = `${SITE_CONFIG.url}/logo-512.png`;

const organization = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_CONFIG.name,
  legalName: LEGAL_COMPANY.legalName,
  alternateName: LEGAL_COMPANY.legalNameEn,
  url: SITE_CONFIG.url,
  logo: LOGO_URL,
  email: LEGAL_COMPANY.email,
  taxID: LEGAL_COMPANY.taxId,
  address: {
    '@type': 'PostalAddress',
    streetAddress: LEGAL_COMPANY.addressStreet,
    addressLocality: 'Cần Thơ',
    addressCountry: 'VN',
  },
  sameAs: [SITE_CONFIG.social.tiktok],
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_CONFIG.url,
  name: SITE_CONFIG.name,
  inLanguage: 'vi',
  publisher: { '@id': ORGANIZATION_ID },
};

// No aggregateRating: Google shows app rich results only with one, and it must come from
// ratings shown on the page itself, which the site does not publish.
const mobileApplication = {
  '@type': 'MobileApplication',
  name: SITE_CONFIG.name,
  alternateName: 'Nutree: Eat With Science',
  description: SITE_DESCRIPTION,
  url: SITE_CONFIG.url,
  image: LOGO_URL,
  screenshot: `${SITE_CONFIG.url}/images/vi/dashboard.webp`,
  operatingSystem: 'iOS, Android',
  applicationCategory: 'HealthApplication',
  downloadUrl: [SITE_CONFIG.stores.appStore, SITE_CONFIG.stores.googlePlay],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@id': ORGANIZATION_ID },
};

/** Home page graph: who publishes the site, the site itself, and the app it promotes. */
export const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [organization, website, mobileApplication],
};
