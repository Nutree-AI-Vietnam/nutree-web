export const PAY_BANK = {
  accountName: 'NUTREE AI VIETNAM',
  accountNumber: '480088383',
  bankName: 'MB Bank',
  qrSrc: '/pay/mbbank-vietqr.png',
  qrAlt: 'MB Bank VietQR for NUTREE AI VIETNAM',
} as const;

export const PAY_AMOUNTS = {
  monthly: 99_000,
  yearly: 399_000,
} as const;

export type PayPlanId = keyof typeof PAY_AMOUNTS;

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function transferContent(planId: PayPlanId): string {
  return planId === 'yearly' ? 'NUTREE NAM' : 'NUTREE THANG';
}
