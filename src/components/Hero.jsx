import { Button } from "../components/ui/button";
import { ArrowRight, Play, Code2, Monitor, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const floatingTech = [
  { label: "Python", color: "text-yellow-400", icon: Code2 },
  { label: "React", color: "text-cyan-400", icon: Monitor },
  { label: "SEO", color: "text-purple-400", icon: TrendingUp },
  { label: "AWS", color: "text-orange-400", icon: Shield },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              India's #1 IT Training Institute
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Launch Your{" "}
              <span className="text-gradient">Tech Career</span>
              <br />
              with Expert-Led IT Courses
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Master in-demand IT skills — Web Development, Python, Digital Marketing, Data Science, Cloud & more. Industry-certified courses with live classes, recorded videos, and hands-on projects.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                onClick={() => navigate("/classes")}
                size="lg"
                className="bg-primary text-background hover:bg-primary/90 glow-cyan group"
              >
                Explore Courses
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/plans")}
                size="lg"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary gap-2"
              >
                <Play className="w-4 h-4" />
                View Plans
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">IT Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15K+</div>
                <div className="text-sm text-muted-foreground">Students Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Placement Rate</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in lg:block hidden">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative bg-card border border-border rounded-2xl p-8 glow-cyan">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-10 h-10 text-background" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">Start Learning Today</h3>
                <p className="text-muted-foreground text-sm">Pick a course & go live in minutes</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {floatingTech.map((tech) => (
                  <div key={tech.label} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 border border-border hover:border-primary/40 transition-colors cursor-pointer">
                    <tech.icon className={`w-4 h-4 ${tech.color}`} />
                    <span className="text-sm font-medium text-foreground">{tech.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {["Live & Recorded Classes", "Industry Certifications", "Job Placement Support", "Expert IT Mentors"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
