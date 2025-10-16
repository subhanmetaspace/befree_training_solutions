import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "../assets/hero-learning.jpg";
import { useNavigate } from "react-router-dom"; // ✅ fixed import

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* ✅ Add pointer-events-none so overlay doesn't block clicks */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              🎓 Learn Skills for the Future
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Master New Skills
              <span className="block text-primary mt-2">At Your Own Pace</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Access expert-led courses designed for learners of all ages. Build practical skills with our comprehensive learning platform and flexible subscription plans.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/classes")}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground group cursor-pointer"
              >
                Start Learning Today
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in lg:block hidden">
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-full pointer-events-none"></div>
            <img
              src={heroImage}
              alt="Students learning online"
              className="relative rounded-2xl shadow-hover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
