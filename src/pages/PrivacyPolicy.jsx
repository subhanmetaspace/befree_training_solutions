import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 animate-fade-in">
                Privacy Policy
              </h1>

              <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground animate-slide-up">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <p>
                    We collect information that you provide directly to us,
                    including your name, email address, and any other
                    information you choose to provide when creating an account
                    or using our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <p>
                    We use the information we collect to provide, maintain, and
                    improve our services, to communicate with you, and to
                    personalize your learning experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    3. Information Sharing
                  </h2>
                  <p>
                    We do not share your personal information with third parties
                    except as described in this policy or with your consent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    4. Data Security
                  </h2>
                  <p>
                    We take reasonable measures to help protect your personal
                    information from loss, theft, misuse, unauthorized access,
                    disclosure, alteration, and destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    5. Your Rights
                  </h2>
                  <p>
                    You have the right to access, update, or delete your
                    personal information at any time through your account
                    settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    6. Cookies
                  </h2>
                  <p>
                    We use cookies and similar tracking technologies to track
                    activity on our service and hold certain information. You
                    can instruct your browser to refuse all cookies or to
                    indicate when a cookie is being sent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    7. Changes to This Policy
                  </h2>
                  <p>
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    8. Contact Us
                  </h2>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    contact us at privacy@befree.com
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
