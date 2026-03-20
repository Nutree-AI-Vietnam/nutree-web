import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service | Nutree',
  description: 'Terms of Service for Nutree - Read our terms and conditions for using the app.',
  openGraph: {
    title: 'Terms of Service | Nutree',
    description: 'Terms of Service for Nutree',
    type: 'website',
  },
};

export default function TermsOfService() {
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Terms of Service
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

        {/* Table of Contents */}
        <nav className="mb-12 p-6 rounded-xl bg-white/50 border border-border/50">
          <h2 className="font-display font-semibold text-foreground mb-4">Table of Contents</h2>
          <ol className="grid md:grid-cols-2 gap-2 text-sm text-muted list-decimal list-inside">
            <li><a href="#section-1" className="hover:text-primary-forest">Agreement to Terms</a></li>
            <li><a href="#section-2" className="hover:text-primary-forest">Eligibility</a></li>
            <li><a href="#section-3" className="hover:text-primary-forest">Account Registration</a></li>
            <li><a href="#section-4" className="hover:text-primary-forest">Services Description</a></li>
            <li><a href="#section-5" className="hover:text-primary-forest">Subscription Terms</a></li>
            <li><a href="#section-6" className="hover:text-primary-forest">User Content</a></li>
            <li><a href="#section-7" className="hover:text-primary-forest">Prohibited Uses</a></li>
            <li><a href="#section-8" className="hover:text-primary-forest">Medical Disclaimer</a></li>
            <li><a href="#section-9" className="hover:text-primary-forest">Intellectual Property</a></li>
            <li><a href="#section-10" className="hover:text-primary-forest">Disclaimers & Limitations</a></li>
            <li><a href="#section-11" className="hover:text-primary-forest">Termination</a></li>
            <li><a href="#section-12" className="hover:text-primary-forest">Governing Law & Dispute Resolution</a></li>
            <li><a href="#section-13" className="hover:text-primary-forest">Changes to Terms</a></li>
            <li><a href="#section-14" className="hover:text-primary-forest">Contact Information</a></li>
          </ol>
        </nav>

        {/* Content */}
        <div className="space-y-10 text-muted">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">1</span>
              Agreement to Terms
            </h2>
            <div className="pl-11 space-y-3">
              <p>
                By accessing or using Nutree (the &quot;App&quot;), you agree to be bound by these Terms of Service
                (&quot;Terms&quot;). These Terms constitute a legally binding agreement between you and NUTREE AI VIETNAM JOINT STOCK COMPANY (&quot;Nutree&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use the App. Your continued use of
                the App constitutes acceptance of these Terms and any future modifications.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">2</span>
              Eligibility
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Age Requirement</h3>
                <p>
                  You must be at least 13 years old to use Nutree. By using the App, you represent and
                  warrant that you meet this age requirement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Parental Consent</h3>
                <p>
                  If you are between 13 and 18 years of age, you confirm that you have obtained parental or
                  guardian consent to use the App and agree to these Terms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.3 Legal Capacity</h3>
                <p>
                  You represent that you have the legal capacity to enter into this agreement and are not
                  prohibited from using the App under applicable laws.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">3</span>
              Account Registration
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Registration Methods</h3>
                <p>To use Nutree, you may create an account using:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Google Sign-In</li>
                  <li>Apple Sign-In</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for
                  all activities that occur under your account. You must notify us immediately of any
                  unauthorized access or security breach.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.3 Accurate Information</h3>
                <p>
                  You agree to provide accurate, current, and complete information during registration and to
                  update such information to keep it accurate and complete.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">4</span>
              Services Description
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.1 AI Meal Analysis</h3>
                <p>
                  Image-based nutritional analysis powered by Google Gemini AI. Users can photograph meals
                  to receive estimated nutritional information including calories, macronutrients, and ingredients.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.2 Nutrition Tracking</h3>
                <p>
                  Logging and monitoring of meals, calories, macronutrients, and micronutrients with
                  historical data visualization and progress tracking.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.3 AI Meal Suggestions</h3>
                <p>
                  AI-powered meal suggestions based on your dietary goals, preferences, and restrictions.
                  Suggestions include recommended meals with ingredients and nutritional information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.4 Progress Analytics</h3>
                <p>
                  Visual dashboards displaying nutrition trends, goal achievement, and insights to
                  support your health journey.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">5</span>
              Subscription Terms
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.1 Subscription Model</h3>
                <p>
                  Nutree provides core features through in-app subscriptions processed via the Apple App Store.
                  Access to AI meal analysis, nutrition tracking, and progress analytics requires an active subscription.
                  A free trial may be offered, which automatically converts to a paid subscription unless cancelled before the trial period ends.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.2 Auto-Renewal</h3>
                <p>
                  Subscriptions automatically renew unless cancelled at least 24 hours before the end of
                  the current billing period. Your payment method will be charged automatically.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.3 Cancellation</h3>
                <p>
                  You can manage and cancel subscriptions through your device&apos;s app store settings.
                  Access to standard features continues until the end of the current billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.4 Refunds</h3>
                <p>
                  Refunds are handled according to Apple App Store or Google Play Store policies.
                  Please contact the respective platform for refund requests.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.5 Free Trials</h3>
                <p>
                  Free trial periods, if offered, automatically convert to paid subscriptions unless
                  cancelled before the trial ends.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">6</span>
              User Content
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.1 License Grant</h3>
                <p>
                  When you upload meal photos or other content to Nutree, you grant us a non-exclusive,
                  worldwide, royalty-free license to store, process, and analyze that content solely to
                  provide our services to you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.2 Your Representations</h3>
                <p>You represent and warrant that:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>You own or have the necessary rights to the content you upload</li>
                  <li>Your content does not infringe any third-party intellectual property rights</li>
                  <li>Your content does not contain illegal, harmful, or offensive material</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.3 Content Removal</h3>
                <p>
                  We reserve the right to remove any content that violates these Terms or is otherwise
                  objectionable, without prior notice.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-8" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">8</span>
              Prohibited Uses
            </h2>
            <div className="pl-11 space-y-3">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the App for any illegal or unauthorized purpose</li>
                <li>Attempt to reverse engineer, decompile, or hack the App</li>
                <li>Upload malicious content, malware, or viruses</li>
                <li>Scrape, harvest, or collect data from the App without permission</li>
                <li>Impersonate others or provide false information</li>
                <li>Interfere with the App&apos;s operation or server infrastructure</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">7</span>
              Medical Disclaimer
            </h2>
            <div className="pl-11 space-y-4">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="font-semibold text-amber-800">
                  IMPORTANT: Nutree is not a medical service and does not provide medical advice.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.1 General Information Only</h3>
                <p>
                  The App provides general nutritional information for educational and informational
                  purposes only. It is not intended as a substitute for professional medical advice,
                  diagnosis, or treatment.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.2 AI Accuracy Limitations</h3>
                <p>
                  AI-generated nutritional estimates may contain inaccuracies. Always verify important
                  nutritional information with reliable sources or healthcare professionals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.3 Consult Healthcare Providers</h3>
                <p>
                  Always consult a qualified healthcare professional before making dietary changes,
                  especially if you have medical conditions, allergies, or are taking medications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">7.4 Not for Medical Conditions</h3>
                <p>
                  The App is not intended to diagnose, treat, cure, or prevent any disease or medical
                  condition. Do not rely on the App for managing health conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">8</span>
              Intellectual Property
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.1 Ownership</h3>
                <p>
                  All content, features, functionality, trademarks, and intellectual property of Nutree
                  (excluding user-generated content) are owned by Nutree and protected by copyright,
                  trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">8.2 Limited License</h3>
                <p>
                  We grant you a limited, non-exclusive, non-transferable, revocable license to use the
                  App for personal, non-commercial purposes in accordance with these Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">9</span>
              Disclaimers & Limitations
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.1 &quot;As Is&quot; Basis</h3>
                <p>
                  The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
                  whether express, implied, or statutory.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.2 No Guarantees</h3>
                <p>We do not guarantee:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>Accuracy or completeness of AI nutritional analysis</li>
                  <li>Uninterrupted, error-free, or secure service</li>
                  <li>Specific results from using the App</li>
                  <li>Correction of defects or errors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">9.3 Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Nutree shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages arising from your use of or
                  inability to use the App.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">10</span>
              Termination
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.1 Termination by Us</h3>
                <p>
                  We may suspend or terminate your access to the App at any time, with or without cause
                  or notice, for violation of these Terms or for any other reason at our discretion.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.2 Termination by You</h3>
                <p>
                  You may delete your account at any time through the App settings. Upon deletion, your
                  data will be removed in accordance with our Privacy Policy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">10.3 Effect of Termination</h3>
                <p>
                  Upon termination, your right to use the App ceases immediately. Provisions that by
                  their nature should survive termination will remain in effect.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">11</span>
              Governing Law & Dispute Resolution
            </h2>
            <div className="pl-11 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.1 Governing Law</h3>
                <p>
                  These Terms and any dispute arising out of or related to them shall be governed by
                  and construed in accordance with the laws of Vietnam, without regard to its conflict
                  of law principles.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.2 Dispute Resolution</h3>
                <p>
                  Any dispute, controversy, or claim arising out of or relating to these Terms or the
                  breach, termination, or invalidity thereof, shall be resolved in the first instance
                  through good faith negotiations between the parties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.3 Competent Courts</h3>
                <p>
                  If the dispute cannot be resolved through negotiation within thirty (30) days, the
                  parties agree that the competent courts of Vietnam shall have exclusive jurisdiction
                  to resolve such disputes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">12</span>
              Changes to Terms
            </h2>
            <div className="pl-11 space-y-3">
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of significant
                changes through the App or by email to the address associated with your account.
              </p>
              <p>
                Your continued use of the App after the effective date of revised Terms constitutes your
                acceptance of the changes. If you do not agree to the revised Terms, you must stop using
                the App.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="scroll-mt-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-forest/10 text-primary-forest text-sm font-bold">13</span>
              Contact Information
            </h2>
            <div className="pl-11 space-y-4">
              <p>
                If you have any questions, concerns, or feedback regarding these Terms of Service,
                please contact us:
              </p>
              <div className="p-4 rounded-lg bg-white border border-border/50">
                <p className="font-semibold text-foreground mb-2">NUTREE AI VIETNAM JOINT STOCK COMPANY</p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-primary-forest hover:text-primary-teal">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </p>
              </div>
              <p className="text-sm">
                We will endeavor to respond to your inquiry within a reasonable timeframe.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Nutree AI. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="text-primary-forest hover:text-primary-teal">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-primary-forest hover:text-primary-teal">Home</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
