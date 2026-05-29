import { Card } from "../components/ui/card";
import { Video, Radio, Code2, Award, Users, Clock, Laptop, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Recorded Video Courses",
    description: "Access 200+ HD recorded lectures anytime, anywhere. Learn at your own pace with lifetime access.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Radio,
    title: "Live Classes",
    description: "Join real-time live sessions with expert IT instructors. Ask questions and get instant answers.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Code2,
    title: "Coding Practice",
    description: "Hands-on coding labs and real-world projects to build your portfolio and sharpen your skills.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Award,
    title: "Industry Certifications",
    description: "Earn recognized certificates upon completion to boost your resume and career prospects.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Users,
    title: "Expert IT Instructors",
    description: "Learn from working professionals with 10+ years of industry experience in top tech companies.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Laptop,
    title: "Skill Development Portal",
    description: "A complete portal to track your progress, skills roadmap, assignments, and project submissions.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Mentor Support",
    description: "Get personal guidance from dedicated mentors for doubt clearing, project reviews, and career advice.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Clock,
    title: "Flexible Subscriptions",
    description: "Choose monthly or yearly plans. Cancel anytime. No hidden charges — pure learning value.",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
            Why Digiweb Star?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Master IT Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete online IT learning ecosystem — from recorded courses and live classes to certifications and job placement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card hover:shadow-hover transition-all duration-300 border-border hover:border-primary/30 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-base font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
