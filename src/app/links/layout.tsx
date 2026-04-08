/**
 * Standalone layout for /links — no Header/Footer.
 * Link-in-bio pages are self-contained, optimized for TikTok WebView.
 */
export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-aurora">
      {children}
    </div>
  );
}
