import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nutree',
  description: 'Privacy Policy for Nutree - Learn how we collect, use, and protect your data.',
  openGraph: {
    title: 'Privacy Policy | Nutree',
    description: 'Privacy Policy for Nutree',
    type: 'website',
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-white to-primary-teal/5">
      <div className="container mx-auto px-4 py-20">
        {/* Back to Home Link */}
        <Link
          href="/"
          aria-label="Back to home page"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-forest transition-colors hover:text-primary-teal mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-forest text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-muted">Nutree Application</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <span><strong>Effective Date:</strong> February 1, 2026</span>
            <span><strong>Last Updated:</strong> February 1, 2026</span>
            <span><strong>Version:</strong> 2.0</span>
          </div>
        </header>

        {/* Privacy Highlights */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-primary-teal/20 bg-primary-teal/5 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">We Don&apos;t Sell Your Data</h3>
            <p className="text-sm text-muted">Your personal information is never sold to third parties for any purpose.</p>
          </div>
          <div className="rounded-xl border border-primary-teal/20 bg-primary-teal/5 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">No Ads or Behavioral Tracking</h3>
            <p className="text-sm text-muted">We don&apos;t display advertisements or track you for advertising purposes.</p>
          </div>
          <div className="rounded-xl border border-primary-teal/20 bg-primary-teal/5 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">Delete Anytime</h3>
            <p className="text-sm text-muted">Delete your account and all data is permanently removed within 30 days.</p>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 rounded-xl bg-white/50 border border-border/50">
          <h2 className="font-display font-semibold text-foreground mb-4">Table of Contents</h2>
          <ol className="grid md:grid-cols-2 gap-2 text-sm text-muted list-decimal list-inside">
            <li><a href="#section-1" className="hover:text-primary-forest">Introduction</a></li>
            <li><a href="#section-2" className="hover:text-primary-forest">Information We Collect</a></li>
            <li><a href="#section-3" className="hover:text-primary-forest">How We Use Your Information</a></li>
            <li><a href="#section-4" className="hover:text-primary-forest">Third-Party Services</a></li>
            <li><a href="#section-5" className="hover:text-primary-forest">AI & Image Processing</a></li>
            <li><a href="#section-6" className="hover:text-primary-forest">Data Retention</a></li>
            <li><a href="#section-7" className="hover:text-primary-forest">Your Rights</a></li>
            <li><a href="#section-8" className="hover:text-primary-forest">Data Security</a></li>
            <li><a href="#section-9" className="hover:text-primary-forest">Children&apos;s Privacy</a></li>
            <li><a href="#section-10" className="hover:text-primary-forest">International Users</a></li>
            <li><a href="#section-11" className="hover:text-primary-forest">Changes to This Policy</a></li>
            <li><a href="#section-12" className="hover:text-primary-forest">Contact Information</a></li>
          </ol>
        </nav>

        {/* Content */}
        <div className="space-y-10 text-muted">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">1</span>
              Introduction
            </h2>
            <div className="pl-11 space-y-3">
              <p>
                This Privacy Policy describes how NUTREE AI VIETNAM JOINT STOCK COMPANY (&quot;Nutree&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses,
                discloses, and protects your personal information when you use our mobile application
                and related services (collectively, the &quot;Services&quot;).
              </p>
              <p>
                We are committed to protecting your privacy and being transparent about our data practices.
                By using our Services, you consent to the collection and use of information in accordance
                with this policy.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">2</span>
              Information We Collect
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Personal Information</h3>
                <p>Information you provide directly to us:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li><strong>Account Information:</strong> Email address, name (from Google/Apple Sign-In)</li>
                  <li><strong>Profile Data:</strong> Date of birth, gender, height, weight, activity level</li>
                  <li><strong>Dietary Preferences:</strong> Food preferences, restrictions, allergies, health goals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Health & Nutrition Data</h3>
                <p>Information related to your nutrition tracking:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li><strong>Meal Photos:</strong> Images you upload for nutritional analysis</li>
                  <li><strong>Food Logs:</strong> Meals, ingredients, portions, and timestamps</li>
                  <li><strong>Nutrition History:</strong> Calorie, macronutrient, and micronutrient data over time</li>
                  <li><strong>Progress Data:</strong> Weight changes, goal progress, and meal suggestion history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.3 Technical Data</h3>
                <p>Information collected automatically:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li><strong>Device Information:</strong> Device type, operating system, app version</li>
                  <li><strong>Usage Data:</strong> Features used, interaction patterns (via Firebase Analytics)</li>
                  <li><strong>Error Logs:</strong> Crash reports and error diagnostics (via Sentry)</li>
                  <li><strong>Push Tokens:</strong> Device tokens for push notifications (via Firebase Cloud Messaging)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">3</span>
              How We Use Your Information
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Service Provision</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Analyze meal photos and provide nutritional information</li>
                  <li>Calculate and track your daily nutrition intake</li>
                  <li>Generate personalized meal suggestions and recommendations</li>
                  <li>Display progress analytics and insights</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Personalization</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Tailor meal suggestions to your goals and preferences</li>
                  <li>Customize the app experience based on your settings</li>
                  <li>Provide relevant notifications and reminders</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.3 Service Improvement</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Understand usage patterns and fix issues</li>
                  <li>Improve app performance and reliability</li>
                  <li>Develop new features based on user needs</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.4 Communication</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Send meal reminders and progress updates</li>
                  <li>Notify you of important account or service changes</li>
                  <li>Respond to your support inquiries</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-primary-teal/5 border border-primary-teal/20">
                <p className="font-semibold text-foreground">
                  We do NOT use your data for advertising, behavioral profiling, or selling to third parties.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">4</span>
              Third-Party Services
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                We use trusted third-party services to operate Nutree. Each service processes only
                the minimum data necessary for its function.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="py-3 px-4 text-left font-semibold text-foreground">Service</th>
                      <th className="py-3 px-4 text-left font-semibold text-foreground">Purpose</th>
                      <th className="py-3 px-4 text-left font-semibold text-foreground">Data Shared</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Firebase Auth</td>
                      <td className="py-3 px-4">User authentication</td>
                      <td className="py-3 px-4">Email, user ID</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Google Gemini AI</td>
                      <td className="py-3 px-4">Meal image analysis</td>
                      <td className="py-3 px-4">Meal photos (processed, not stored)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Cloudinary</td>
                      <td className="py-3 px-4">Image storage</td>
                      <td className="py-3 px-4">Meal photos</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">RevenueCat</td>
                      <td className="py-3 px-4">Subscription management</td>
                      <td className="py-3 px-4">Purchase data, user ID</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Firebase Analytics</td>
                      <td className="py-3 px-4">App usage analytics</td>
                      <td className="py-3 px-4">Anonymous usage events</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">Firebase Cloud Messaging</td>
                      <td className="py-3 px-4">Push notifications</td>
                      <td className="py-3 px-4">Device tokens</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-foreground">Sentry</td>
                      <td className="py-3 px-4">Error tracking</td>
                      <td className="py-3 px-4">Crash logs, device info</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium text-foreground">PostHog</td>
                      <td className="py-3 px-4">Product analytics & session replay</td>
                      <td className="py-3 px-4">Anonymous usage events, session recordings, device info</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm">
                Each third-party service has its own privacy policy governing their data practices.
                We encourage you to review their policies for more information.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">5</span>
              AI & Image Processing
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.1 Meal Photo Analysis</h3>
                <p>
                  When you scan a meal, your photo is sent to Google Gemini AI for nutritional analysis.
                  The image is processed in real-time to identify ingredients and estimate nutritional
                  content. Google does not store these images for their own AI training purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.2 Image Storage</h3>
                <p>
                  Your meal photos are stored securely on Cloudinary to maintain your meal history
                  and allow you to review past meals. Photos are associated with your account and
                  are deleted when you delete your account.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">6</span>
              Data Retention
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.1 Active Accounts</h3>
                <p>
                  Your personal data, nutrition history, and meal photos are retained while your
                  account remains active to provide continuous service and maintain your progress history.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.2 Account Deletion</h3>
                <p>
                  When you delete your account, all personal data is permanently removed from our
                  servers within 30 days. This includes your profile, meal logs, photos, and all
                  associated data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.3 Anonymized Data</h3>
                <p>
                  Aggregated, non-identifiable analytics data may be retained indefinitely to help
                  us understand usage patterns and improve our services. This data cannot be linked
                  back to individual users.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">7</span>
              Your Rights
            </h2>
            <div className="pl-11 space-y-4">
              <p>You have the following rights regarding your personal data:</p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.1 Right to Access</h3>
                <p>Request a copy of the personal data we hold about you.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.2 Right to Export</h3>
                <p>Download your data in a portable, machine-readable format.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.3 Right to Correct</h3>
                <p>Update or correct inaccurate information in your profile.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.4 Right to Delete</h3>
                <p>Request deletion of your account and all associated personal data.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.5 Right to Withdraw Consent</h3>
                <p>Opt out of optional data uses at any time without affecting core service functionality.</p>
              </div>
              <div className="p-4 rounded-lg bg-white border border-border/50">
                <p className="text-sm">
                  <strong>To exercise these rights:</strong> Use the settings within the app or contact us at{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-primary-forest hover:text-primary-teal">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">8</span>
              Data Security
            </h2>
            <div className="pl-11 space-y-4">
              <p>We implement industry-standard security measures to protect your data:</p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.1 Encryption in Transit</h3>
                <p>All data transmitted between your device and our servers is encrypted using HTTPS/TLS protocols.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.2 Encryption at Rest</h3>
                <p>Sensitive data stored in our databases is encrypted using industry-standard encryption algorithms.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.3 Access Controls</h3>
                <p>Strict access controls and authentication mechanisms limit who can access your data.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.4 Regular Security Reviews</h3>
                <p>Our security practices and infrastructure are reviewed and updated regularly.</p>
              </div>
              <p className="text-sm">
                While we implement robust security measures, no system is 100% secure. We encourage
                you to use a strong, unique password and keep your device secure.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">9</span>
              Children&apos;s Privacy
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.1 Age Requirement</h3>
                <p>
                  Nutree is intended for users aged 13 and older. We do not knowingly collect
                  personal information from children under 13 years of age.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.2 Parental Notice</h3>
                <p>
                  If we discover that a child under 13 has provided personal information without
                  parental consent, we will promptly delete that information from our servers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.3 Reporting</h3>
                <p>
                  If you believe a child under 13 has provided us with personal information, please
                  contact us immediately at{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-primary-forest hover:text-primary-teal">
                    {SITE_CONFIG.supportEmail}
                  </a>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">10</span>
              International Users
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.1 Data Processing Location</h3>
                <p>
                  Nutree is operated by NUTREE AI VIETNAM JOINT STOCK COMPANY. Your data may be
                  processed in servers located in various regions, including the United States and
                  other locations where our cloud service providers operate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.2 European Union Users (GDPR)</h3>
                <p>If you are located in the EU/EEA, you have additional rights under GDPR:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>We process your data based on consent and contractual necessity</li>
                  <li>You have the right to data portability</li>
                  <li>You may lodge complaints with your local supervisory authority</li>
                  <li>You can request restriction of processing or object to processing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.3 California Users (CCPA)</h3>
                <p>If you are a California resident, you have rights under CCPA:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to request deletion of your personal information</li>
                  <li>Right to opt out of sale of personal information (note: we do not sell your data)</li>
                  <li>Right to non-discrimination for exercising your privacy rights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">11</span>
              Changes to This Policy
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.1 Policy Updates</h3>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, technologies, legal requirements, or other factors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.2 Notification of Changes</h3>
                <p>
                  We will notify you of significant changes through the App or by email to the
                  address associated with your account. The &quot;Last Updated&quot; date at the top of
                  this policy indicates when it was last revised.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.3 Continued Use</h3>
                <p>
                  Your continued use of our Services after the effective date of the revised Privacy
                  Policy constitutes your acceptance of the changes. If you do not agree to the
                  revised policy, please discontinue use of the Services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">12</span>
              Contact Information
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or
                your personal data, please contact us:
              </p>
              <div className="p-6 rounded-lg bg-white border border-border/50">
                <p className="font-semibold text-foreground mb-3">NUTREE AI VIETNAM JOINT STOCK COMPANY</p>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-primary-forest hover:text-primary-teal">
                      {SITE_CONFIG.supportEmail}
                    </a>
                  </p>
                  <p>
                    <strong>Subject Line:</strong> Privacy Inquiry
                  </p>
                </div>
              </div>
              <p className="text-sm">
                We will respond to your inquiry within 30 days. For EU residents, we aim to respond
                within the timeframes required by GDPR.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Nutree. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/terms" className="text-primary-forest hover:text-primary-teal">Terms of Service</Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-primary-forest hover:text-primary-teal">Home</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
