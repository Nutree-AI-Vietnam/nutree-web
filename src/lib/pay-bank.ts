export const PAY_BANK = {
  accountName: 'NUTREE AI VIETNAM',
  accountNumber: '480088383',
  bankName: 'MB Bank',
  qrSrc: '/pay/mbbank-vietqr.png',
  qrAlt: 'MB Bank VietQR for NUTREE AI VIETNAM',
} as const;

// Nutree sells one plan only: the yearly plan.
export const PAY_AMOUNTS = {
  yearly: 599_000,
} as const;

export type PayPlanId = keyof typeof PAY_AMOUNTS;

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}
