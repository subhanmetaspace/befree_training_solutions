import { Card } from "../components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Web Developer",
    content: "SkillHub transformed my career! The programming courses are comprehensive and the instructors are incredibly knowledgeable. Highly recommend!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Graphic Designer",
    content: "The design courses here are top-notch. I went from beginner to landing my first client in just 3 months. The flexibility is amazing!",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    content: "Best investment in my professional development. The business courses are practical and immediately applicable to real-world scenarios.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful learners who transformed their careers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-card border-border hover:shadow-hover transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-card-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
