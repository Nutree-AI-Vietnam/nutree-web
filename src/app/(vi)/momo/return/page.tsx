import type { Metadata } from 'next';
import { MomoReturnClient } from './momo-return-client';

export const metadata: Metadata = {
  title: 'MoMo | Nutree',
  robots: { index: false, follow: false },
};

export default function MomoReturnPage() {
  return <MomoReturnClient />;
}
