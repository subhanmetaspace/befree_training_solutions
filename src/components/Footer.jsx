import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer id="about" className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillHub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering learners of all ages to master new skills and achieve their goals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#classes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Classes
                </a>
              </li>
              <li>
                <a href="/#teachers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Teachers
                </a>
              </li>
              <li>
                <a href="/my-classes" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Classes
                </a>
              </li>
              <li>
                <a href="/#plans" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/help-center" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 SkillHub. All rights reserved. Built with passion for learners worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
