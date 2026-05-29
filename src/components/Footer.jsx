import { Code2, Mail, Phone, MapPin, Youtube, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Code2 className="w-6 h-6 text-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-foreground leading-tight">Digiweb Star</span>
                <span className="text-xs text-primary leading-tight">Solution Pvt Ltd</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
              India's premier IT training institute offering industry-ready courses in coding, digital marketing, and cloud technology.
            </p>
            <div className="flex gap-3">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary flex items-center justify-center text-muted-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-primary">Courses</h4>
            <ul className="space-y-2 text-sm">
              {["Web Development", "Python Programming", "Digital Marketing", "Data Science", "Cybersecurity", "Cloud Computing"].map(course => (
                <li key={course}>
                  <a href="/classes" className="text-muted-foreground hover:text-primary transition-colors">{course}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-primary">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/teachers" className="text-muted-foreground hover:text-primary transition-colors">Our Instructors</a></li>
              <li><a href="/plans" className="text-muted-foreground hover:text-primary transition-colors">Pricing Plans</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="/help-center" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-primary">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:info.digiwebstar123@gmail.com" className="text-muted-foreground hover:text-primary transition-colors break-all">
                  info.digiwebstar123@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:8108673614" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 81086 73614
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground leading-relaxed">
                  127, K No. 1105/740, Road No. 6, Basni, Jodhpur, Rajasthan – 342005
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Digiweb Star Solution Pvt Ltd. All rights reserved.</p>
          <p>
            <a href="https://learnwithdigiweb.com" className="text-primary hover:underline">learnwithdigiweb.com</a>
            {" "}— Empowering India's IT Talent
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
