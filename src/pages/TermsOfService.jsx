import Header from "../components/Header";
import Footer from "../components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 animate-fade-in">
                Terms of Service
              </h1>
              
              <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground animate-slide-up">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using SkillHub, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Use License</h2>
                  <p>
                    Permission is granted to temporarily access the materials (information or software) on SkillHub for personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                  <p>
                    When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Intellectual Property</h2>
                  <p>
                    The content, organization, graphics, design, and other matters related to SkillHub are protected under applicable copyrights and other proprietary laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Course Access</h2>
                  <p>
                    Subscribers have access to all courses and materials during their active subscription period. Downloaded materials are for personal use only.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Termination</h2>
                  <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
                  <p>
                    In no event shall SkillHub or its suppliers be liable for any damages arising out of the use or inability to use the materials on SkillHub.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Us</h2>
                  <p>
                    If you have any questions about these Terms, please contact us at support@skillhub.com
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

export default TermsOfService;
