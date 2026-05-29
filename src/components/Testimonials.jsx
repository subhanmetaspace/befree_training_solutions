import { Card } from "../components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full-Stack Developer — placed at TCS",
    content: "Digiweb Star's Web Development course completely changed my career. The live sessions were amazing and the recorded videos helped me revise at night. Got placed within 2 months of completing the course!",
    rating: 5,
    course: "Full-Stack Web Development",
  },
  {
    name: "Priya Verma",
    role: "Digital Marketing Specialist",
    content: "The Digital Marketing course is incredibly practical. SEO, Google Ads, social media — everything was covered with real campaigns. I now run ads for 3 companies on my own!",
    rating: 5,
    course: "Digital Marketing",
  },
  {
    name: "Amit Patel",
    role: "Python Developer — Freelancer",
    content: "I had zero coding knowledge before joining Digiweb Star. After their Python + Data Science course, I'm earning ₹80K/month as a freelancer. Best investment of my life.",
    rating: 5,
    course: "Python & Data Science",
  },
  {
    name: "Sneha Rajput",
    role: "Cloud Engineer at Infosys",
    content: "The AWS Cloud Computing course is top-notch. Hands-on labs, real projects, and mentors who actually work in cloud. Got my AWS certification on first attempt!",
    rating: 5,
    course: "Cloud Computing (AWS)",
  },
  {
    name: "Vikram Joshi",
    role: "Cybersecurity Analyst",
    content: "Excellent curriculum for cybersecurity. The instructors have industry experience and teach real-world attack/defense techniques. Highly recommended for anyone targeting IT security.",
    rating: 5,
    course: "Cybersecurity",
  },
  {
    name: "Kavita Singh",
    role: "Mobile App Developer",
    content: "The React Native course was detailed and structured. From basics to publishing an app on Play Store — everything was covered. The doubt-clearing sessions are a game changer!",
    rating: 5,
    course: "Mobile App Development",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
            Student Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Results from{" "}
            <span className="text-gradient">Real Students</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 15,000+ students who transformed their careers with Digiweb Star IT courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto animate-slide-up">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/30 hover:shadow-hover transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-card-foreground mb-5 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{testimonial.role}</div>
                <div className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                  {testimonial.course}
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
