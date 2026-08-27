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
  address:
    'NL1-G01, Khu dân cư Sáng Quang, đường Nguyễn Văn Linh, Khóm 6, Phường Phú Lợi, Thành phố Cần Thơ, Việt Nam',
  addressEn:
    'NL1-G01, Sang Quang Residential Area, Nguyen Van Linh Street, Hamlet 6, Phu Loi Ward, Can Tho City, Vietnam',
  email: 'nutreeaidev@gmail.com',
  website: 'https://nutreeai.com',
  websiteDisplay: 'nutreeai.com',
  product: 'Nutree',
  effectiveDate: '06/08/2026',
  version: '1.0',
  representative: 'Lê Thanh Trường',
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
