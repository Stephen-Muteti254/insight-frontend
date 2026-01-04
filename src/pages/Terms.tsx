import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <PublicLayout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </div>

            <Card variant="glass">
              <CardContent className="p-8 prose prose-sm max-w-none dark:prose-invert">
                <div className="space-y-8">
                  <section>
                    <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                      By accessing and using InsightPay, you agree to be bound by these Terms of Service. 
                      If you do not agree to these terms, please do not use our platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
                    <p className="text-muted-foreground">
                      You must be at least 18 years old to use InsightPay. By using our services, 
                      you represent that you meet this age requirement and have the legal capacity 
                      to enter into binding agreements.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
                    <p className="text-muted-foreground">
                      To participate in surveys and receive payments, you must create an account 
                      and complete our application process. You agree to provide accurate, current, 
                      and complete information during registration and to keep your account information updated.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">4. Survey Participation</h2>
                    <p className="text-muted-foreground mb-4">
                      When participating in surveys, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Provide honest and thoughtful responses</li>
                      <li>Complete surveys within the specified time limits</li>
                      <li>Not use automated tools or bots to complete surveys</li>
                      <li>Not share survey content with third parties</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">5. Payments</h2>
                    <p className="text-muted-foreground">
                      Payments are processed via PayPal. Minimum withdrawal amount is $5.00 USD. 
                      Withdrawal requests are processed within 1 business day. We reserve the right 
                      to withhold payments if we suspect fraudulent activity.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">6. Account Termination</h2>
                    <p className="text-muted-foreground">
                      We reserve the right to suspend or terminate accounts that violate these terms, 
                      provide fraudulent responses, or engage in any activity that compromises the 
                      integrity of our platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
                    <p className="text-muted-foreground">
                      InsightPay is provided "as is" without warranties of any kind. We shall not be 
                      liable for any indirect, incidental, special, or consequential damages arising 
                      from your use of our services.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
                    <p className="text-muted-foreground">
                      We may update these terms from time to time. We will notify you of significant 
                      changes via email or through our platform. Continued use of InsightPay after 
                      changes constitutes acceptance of the new terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
                    <p className="text-muted-foreground">
                      If you have questions about these Terms of Service, please contact us at 
                      legal@insightpay.com.
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
