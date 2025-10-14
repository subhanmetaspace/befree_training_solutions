import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Code, Palette, TrendingUp, Languages, Camera, Music } from "lucide-react";

const categories = [
  {
    icon: Code,
    title: "Programming & Development",
    description: "Web, mobile, and software development courses",
    courses: 120,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Palette,
    title: "Design & Creativity",
    description: "Graphic design, UI/UX, and digital arts",
    courses: 85,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Business & Marketing",
    description: "Entrepreneurship, digital marketing, and sales",
    courses: 95,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Languages,
    title: "Languages",
    description: "Learn new languages with native speakers",
    courses: 65,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Camera,
    title: "Photography & Video",
    description: "Visual storytelling and content creation",
    courses: 50,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Music,
    title: "Music & Audio",
    description: "Music production, instruments, and theory",
    courses: 40,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

const Courses = () => {
  return (
    <section id="courses" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Our Course Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From beginners to experts, find the perfect course for your skill level
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-card hover:shadow-hover transition-all duration-300 border-border hover:border-primary/20 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-7 h-7 ${category.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {category.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {category.description}
              </p>
              <Badge variant="secondary" className="font-medium">
                {category.courses} courses
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
