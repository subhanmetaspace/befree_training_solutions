import Header from "../components/Header";
import Footer from "../components/Footer";
import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "We believe in building a supportive learning community where everyone can thrive.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We're committed to delivering high-quality education that meets industry standards.",
    },
    {
      icon: Award,
      title: "Achievement",
      description: "Your success is our success. We celebrate every milestone you reach.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about making learning accessible, engaging, and transformative.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About SkillHub
              </h1>
              <p className="text-lg text-muted-foreground">
                We're on a mission to make quality education accessible to everyone, everywhere.
                Learn from expert instructors and join a community of passionate learners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 animate-slide-up">
              <div className="bg-gradient-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
                <p className="text-muted-foreground">
                  Founded in 2025, SkillHub started with a simple idea: everyone deserves access
                  to world-class education. Today, we're proud to serve thousands of students
                  worldwide, offering courses across various disciplines.
                </p>
              </div>
              <div className="bg-gradient-card rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  We envision a world where learning never stops, where anyone can acquire new
                  skills and transform their career at any stage of life. Through innovative
                  teaching methods and expert instructors, we make this vision a reality.
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-card rounded-lg p-6 border border-border hover:shadow-hover transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
