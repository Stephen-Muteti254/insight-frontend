import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
  return (
    <PublicLayout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>

            <Card variant="glass">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                    <p className="text-muted-foreground">
                      At InsightPay, we take your privacy seriously. This Privacy Policy explains 
                      how we collect, use, disclose, and safeguard your information when you use 
                      our platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                    <p className="text-muted-foreground mb-4">We collect information you provide directly:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Account information (name, email, password)</li>
                      <li>Profile data from application questionnaire</li>
                      <li>Survey responses</li>
                      <li>Payment information (PayPal email)</li>
                      <li>Communications with our support team</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>To provide and maintain our services</li>
                      <li>To process payments and transactions</li>
                      <li>To match you with relevant surveys</li>
                      <li>To communicate with you about your account</li>
                      <li>To improve our platform and user experience</li>
                      <li>To detect and prevent fraud</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
                    <p className="text-muted-foreground mb-4">
                      We share your information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>Survey Responses:</strong> Anonymized and aggregated responses are shared with survey requesters</li>
                      <li><strong>Payment Processing:</strong> Payment data is shared with PayPal for transactions</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      <strong>We never sell your personal information to third parties.</strong>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                    <p className="text-muted-foreground">
                      We implement industry-standard security measures to protect your data, 
                      including encryption, secure servers, and regular security audits. However, 
                      no method of transmission over the Internet is 100% secure.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                    <p className="text-muted-foreground mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Export your data in a portable format</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
                    <p className="text-muted-foreground">
                      We use essential cookies to maintain your session and preferences. 
                      We may use analytics cookies to understand how users interact with our 
                      platform. You can control cookie preferences in your browser settings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">8. Data Retention</h2>
                    <p className="text-muted-foreground">
                      We retain your personal data for as long as your account is active or 
                      as needed to provide services. After account deletion, we may retain 
                      certain data for legal and business purposes for up to 3 years.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
                    <p className="text-muted-foreground">
                      For privacy-related inquiries, please contact our Data Protection Officer 
                      at privacy@insightpay.com.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
