import { useState } from "react";
import { Button } from "../components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SkillHub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Classes
            </a>
            <a href="#teachers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Teachers
            </a>
            <a href="#plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Plans
            </a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => window.location.href = '/auth'}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-border flex flex-col gap-2">
            <a href="#classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Classes
            </a>
            <a href="#teachers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Teachers
            </a>
            <a href="#plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Plans
            </a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90" onClick={() => window.location.href = '/auth'}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
