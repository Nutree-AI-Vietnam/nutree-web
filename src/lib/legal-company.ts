/** Street part of the registered address; structured data lists city and country separately. */
const ADDRESS_STREET =
  'NL1-G01, Khu dân cư Sáng Quang, đường Nguyễn Văn Linh, Khóm 6, Phường Phú Lợi';

/** Official company identity for VN legal / BCT disclosure pages. */
export const LEGAL_COMPANY = {
  legalName: 'CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM',
  legalNameEn: 'NUTREE AI VIETNAM JOINT STOCK COMPANY',
  tradeName: 'NUTREE AI VIETNAM',
  taxId: '2200826051',
  /** Tax / enterprise registration issue date (public business registry). */
  taxIssuedDate: '14/11/2025',
  /** Issuing / managing tax authority for the MST. */
  taxIssuedPlace: 'Thuế cơ sở 10 thành phố Cần Thơ',
  taxIssuedPlaceEn: 'Tax Office 10, Can Tho City',
  address: `${ADDRESS_STREET}, Thành phố Cần Thơ, Việt Nam`,
  addressStreet: ADDRESS_STREET,
  addressEn:
    'NL1-G01, Sang Quang Residential Area, Nguyen Van Linh Street, Hamlet 6, Phu Loi Ward, Can Tho City, Vietnam',
  email: 'nutreeaidev@gmail.com',
  website: 'https://nutreeai.com',
  websiteDisplay: 'nutreeai.com',
  product: 'Nutree',
  effectiveDate: '06/08/2026',
  version: '1.0',
  representative: 'Lê Thanh Trường',
  /** Public listing on the MoIT e-commerce portal (online.gov.vn); target of the "Đã thông báo Bộ Công Thương" badge. */
  bctRegistrationUrl: 'https://online.gov.vn/nen-tang/8827acb5-d544-4881-8984-e67248f540d3',
} as const;

/** Bộ Công Thương e-commerce notification on online.gov.vn. */
export const BO_CONG_THUONG_NOTICE = {
  href: LEGAL_COMPANY.bctRegistrationUrl,
  imageSrc: '/badges/da-thong-bao.png',
  imageWidth: 230,
  imageHeight: 86,
  /** Slightly larger than the 44px official snippet so it reads in the footer. */
  displayHeight: 56,
  title: 'Đã xác nhận với Bộ Công Thương',
  alt: 'Đã xác nhận',
} as const;

export type LegalLocale = 'vi' | 'en';

/** English path slugs for all legal policy pages. */
export const LEGAL_LINKS: Array<{
  href: string;
  label: Record<LegalLocale, string>;
}> = [
  {
    href: '/privacy',
    label: { vi: 'Chính sách bảo mật', en: 'Privacy Policy' },
  },
  {
    href: '/terms',
    label: {
      vi: 'Điều khoản sử dụng',
      en: 'Terms of Service',
    },
  },
  {
    href: '/usage',
    label: {
      vi: 'Chính sách sử dụng',
      en: 'Usage Policy',
    },
  },
  {
    href: '/pricing',
    label: { vi: 'Chính sách giá', en: 'Pricing Policy' },
  },
  {
    href: '/payment',
    label: { vi: 'Chính sách thanh toán', en: 'Payment Policy' },
  },
  {
    href: '/cancellation',
    label: {
      vi: 'Hủy & hoàn tiền',
      en: 'Cancellation & Refunds',
    },
  },
  {
    href: '/complaints',
    label: {
      vi: 'Khiếu nại & hỗ trợ',
      en: 'Complaints & Support',
    },
  },
];
