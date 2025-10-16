import { Card } from "../components/ui/card";
import { BookOpen, Users, Clock, Award, Video, MessageCircle } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Expert Instructors",
    description: "Learn from industry professionals with real-world experience",
  },
  {
    icon: Video,
    title: "HD Video Lessons",
    description: "High-quality video content accessible anytime, anywhere",
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Study at your own pace with lifetime access to courses",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with fellow learners and grow together",
  },
//   {
//     icon: Award,
//     title: "Certificates",
//     description: "Earn recognized certificates upon course completion",
//   },
  {
    icon: MessageCircle,
    title: "Direct Mentorship",
    description: "Get personalized guidance from experienced mentors",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose BeFree Training Solutions?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card hover:shadow-hover transition-all duration-300 border-border hover:border-primary/20 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
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
