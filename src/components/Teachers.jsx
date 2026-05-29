import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Star, BookOpen, Briefcase } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";

const defaultTeachers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.9,
    total_classes: 18,
    bio: "Senior Full-Stack Developer with 12 years at Infosys & TCS. Teaches HTML, CSS, JavaScript, React, and Node.js.",
    expertise: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    name: "Ananya Sharma",
    avatar_url: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 4.8,
    total_classes: 22,
    bio: "Digital Marketing expert with 8 years experience managing campaigns for Fortune 500 brands. Google & Meta certified.",
    expertise: ["SEO", "Google Ads", "Social Media"],
  },
  {
    id: 3,
    name: "Suresh Patel",
    avatar_url: "https://randomuser.me/api/portraits/men/47.jpg",
    rating: 4.9,
    total_classes: 25,
    bio: "Python & Data Science specialist with PhD in Computer Science. Former Data Scientist at Amazon.",
    expertise: ["Python", "Machine Learning", "Pandas"],
  },
  {
    id: 4,
    name: "Meera Joshi",
    avatar_url: "https://randomuser.me/api/portraits/women/38.jpg",
    rating: 4.7,
    total_classes: 15,
    bio: "AWS Certified Solutions Architect with 10 years in cloud infrastructure at Microsoft Azure and AWS.",
    expertise: ["AWS", "Azure", "Docker"],
  },
  {
    id: 5,
    name: "Arjun Malhotra",
    avatar_url: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 4.8,
    total_classes: 19,
    bio: "Cybersecurity expert and ethical hacker. Certified CEH & CISSP. Has secured networks for banks and govt agencies.",
    expertise: ["Cybersecurity", "Ethical Hacking", "Linux"],
  },
  {
    id: 6,
    name: "Pooja Gupta",
    avatar_url: "https://randomuser.me/api/portraits/women/55.jpg",
    rating: 4.6,
    total_classes: 14,
    bio: "Mobile App Developer specializing in React Native and Flutter. Has published 20+ apps on Play Store & App Store.",
    expertise: ["React Native", "Flutter", "Firebase"],
  },
  {
    id: 7,
    name: "Deepak Verma",
    avatar_url: "https://randomuser.me/api/portraits/men/60.jpg",
    rating: 4.9,
    total_classes: 28,
    bio: "Database expert with 15 years experience in MySQL, PostgreSQL, and MongoDB. Ex-Oracle DBA.",
    expertise: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    id: 8,
    name: "Nisha Agarwal",
    avatar_url: "https://randomuser.me/api/portraits/women/62.jpg",
    rating: 4.8,
    total_classes: 16,
    bio: "UI/UX designer turned developer. Specializes in Figma, frontend development, and user research for IT products.",
    expertise: ["Figma", "HTML/CSS", "UI/UX"],
  },
];

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BACKEND}/teachers`);
        const data = await res.json();
        setTeachers(data?.data?.length ? data.data : defaultTeachers);
      } catch {
        setTeachers(defaultTeachers);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <section id="instructors" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Industry Experts
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Learn from the{" "}
            <span className="text-gradient">Best in IT</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our instructors are working IT professionals with proven industry track records — not just teachers
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading instructors...</div>
        ) : (
          <div className="relative">
            <Carousel>
              <CarouselPrevious />
              <CarouselContent className="overflow-visible">
                {teachers.map((teacher) => (
                  <CarouselItem key={teacher.id} className="px-2 md:basis-1/2 lg:basis-1/3">
                    <Card className="hover:shadow-hover hover:border-primary/30 transition-all border-border bg-card">
                      <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <Avatar className="w-20 h-20 ring-2 ring-primary/30">
                              {teacher.avatar_url ? (
                                <AvatarImage src={teacher.avatar_url} alt={teacher.name} className="object-cover" />
                              ) : (
                                <AvatarFallback className="text-xl bg-primary text-background">
                                  {teacher.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </div>
                        </div>
                        <CardTitle className="text-base">{teacher.name}</CardTitle>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{teacher.rating?.toFixed(1) || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>{teacher.total_classes || 0} courses</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <CardDescription className="text-center mb-4 text-xs leading-relaxed line-clamp-3">
                          {teacher.bio || "Expert IT instructor passionate about teaching"}
                        </CardDescription>
                        {teacher.expertise && teacher.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {teacher.expertise.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default Teachers;
