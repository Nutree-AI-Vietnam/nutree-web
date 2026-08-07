/** Official company identity for VN legal / BCT disclosure pages. */
export const LEGAL_COMPANY = {
  legalName: 'CÔNG TY CỔ PHẦN NUTREE AI VIỆT NAM',
  legalNameEn: 'NUTREE AI VIETNAM JOINT STOCK COMPANY',
  tradeName: 'NUTREE AI VIETNAM',
  taxId: '2200826051',
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
  pricing: {
    monthlyVnd: '99.000',
    yearlyVnd: '399.000',
    yearlyMonthlyEquivalentVnd: '33.250',
  },
} as const;

export type LegalLocale = 'vi' | 'en';

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
      vi: 'Điều kiện & hạn chế dịch vụ',
      en: 'Service Terms & Limitations',
    },
  },
  {
    href: '/chinh-sach-gia',
    label: { vi: 'Chính sách giá', en: 'Pricing Policy' },
  },
  {
    href: '/chinh-sach-thanh-toan',
    label: { vi: 'Chính sách thanh toán', en: 'Payment Policy' },
  },
  {
    href: '/hoan-tien',
    label: {
      vi: 'Cung cấp, chấm dứt & hoàn tiền',
      en: 'Delivery, Termination & Refunds',
    },
  },
  {
    href: '/khieu-nai',
    label: {
      vi: 'Tiếp nhận & giải quyết khiếu nại',
      en: 'Complaints & Support',
    },
  },
];
