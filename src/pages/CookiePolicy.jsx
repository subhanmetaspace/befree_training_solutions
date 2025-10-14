import Header from "../components/Header";
import Footer from "../components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 animate-fade-in">
                Cookie Policy
              </h1>
              
              <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground animate-slide-up">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString()}
                </p>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. What Are Cookies</h2>
                  <p>
                    Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
                  <p>
                    When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To enable certain functions of the Service</li>
                    <li>To provide analytics</li>
                    <li>To store your preferences</li>
                    <li>To enable authentication and security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Types of Cookies We Use</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h3>
                      <p>These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h3>
                      <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Functionality Cookies</h3>
                      <p>These cookies enable the website to provide enhanced functionality and personalization.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Managing Cookies</h2>
                  <p>
                    You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
                  <p>
                    If you have any questions about our use of cookies, please contact us at privacy@skillhub.com
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

export default CookiePolicy;
