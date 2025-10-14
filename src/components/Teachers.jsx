import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Star, BookOpen } from "lucide-react";
import { useToast } from "../hooks/use-toast";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel"; // Adjust path if needed

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Replace with your API call
      const data = [
        {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
         {
          id: 1,
          name: "Jane Doe",
          avatar_url: "",
          rating: 4.8,
          total_classes: 12,
          bio: "Experienced instructor passionate about teaching coding and web development.",
          expertise: ["React", "JavaScript", "UI/UX"],
        },
        {
          id: 2,
          name: "John Smith",
          avatar_url: "",
          rating: 4.5,
          total_classes: 8,
          bio: "Industry professional in cloud computing and backend development.",
          expertise: ["Node.js", "AWS", "Database"],
        },
        // Add more teachers here
      ];
      setTeachers(data || []);
    } catch (error) {
      toast({
        title: "Error loading teachers",
        description: error.message || "Failed to fetch teachers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="teachers" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Teachers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from industry professionals and passionate educators dedicated to your success
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="text-center text-muted-foreground">No teachers available</div>
        ) : (
          <div className="relative">
            <Carousel>
              <CarouselPrevious />
              <CarouselContent className="overflow-visible">
  {teachers.map((teacher) => (
    <CarouselItem key={teacher.id} className="px-2">
      <Card className="hover:shadow-hover transition-all">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={teacher.avatar_url || ""} alt={teacher.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{teacher.name}</CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{teacher.rating?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{teacher.total_classes || 0} classes</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center mb-4 line-clamp-3">
            {teacher.bio || "Expert instructor passionate about teaching"}
          </CardDescription>
          {teacher.expertise && teacher.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {teacher.expertise.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
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
