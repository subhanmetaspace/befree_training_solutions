import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Download, Video, Calendar, Clock, Star } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [enrollClassModal,setEnrollClassModal] = useState(false);
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // Replace this sample data with your API call
      const data = [
        {
          id: 1,
          title: "Beginner Photography",
          description: "Learn the basics of photography with hands-on examples.",
          duration_minutes: 60,
          type: "live",
          price: 100,
          plan_required: "Starter",
        },
        {
          id: 2,
          title: "Advanced Photoshop Techniques",
          description: "Enhance your editing skills with advanced Photoshop tools.",
          duration_minutes: 90,
          type: "live",
          price: 500,
          plan_required: "Professional",
        },
        {
          id: 3,
          title: "Creative Writing Essentials",
          description: "Master storytelling and improve your writing style.",
          duration_minutes: 75,
          type: "live",
          price: 100,
          plan_required: "Starter",
        },
        {
          id: 4,
          title: "Data Analytics for Business",
          description: "Learn how to analyze business data using Excel and Power BI.",
          duration_minutes: 120,
          type: "live",
          price: 1500,
          plan_required: "Enterprise",
        },
        {
          id: 5,
          title: "Web Development Basics",
          description: "HTML, CSS, and JS fundamentals to build your first website.",
          duration_minutes: 80,
          type: "download",
          price: 100,
          download_url: "#",
          plan_required: "Starter",
        },
        {
          id: 6,
          title: "Full-Stack Web Development",
          description: "Advanced projects with React, Node.js, and MongoDB.",
          duration_minutes: 180,
          type: "download",
          price: 500,
          download_url: "#",
          plan_required: "Professional",
        },
        {
          id: 7,
          title: "Machine Learning Crash Course",
          description: "Hands-on ML projects using Python and scikit-learn.",
          duration_minutes: 200,
          type: "download",
          price: 1500,
          download_url: "#",
          plan_required: "Enterprise",
        },
      ];

      setClasses(data || []);
    } catch (error) {
      toast({
        title: "Error loading classes",
        description: error.message || "Failed to fetch classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadClass = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const scheduleClass = (classId) => {
    navigate(`/schedule-class/${classId}`);
  };

  const downloadClasses = classes.filter((c) => c.type === "download");
  const liveClasses = classes.filter((c) => c.type === "live");

  return (
    <section id="classes" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Our Classes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from downloadable content or join live interactive sessions with expert instructors. Premium classes are available for higher-tier plans.
          </p>
        </div>

        <Tabs defaultValue="live" className="animate-slide-up">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="live" className="gap-2">
              <Video className="w-4 h-4" />
              Live Classes
            </TabsTrigger>
            <TabsTrigger value="download" className="gap-2">
              <Download className="w-4 h-4" />
              Downloads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading classes...</div>
            ) : liveClasses.length === 0 ? (
              <div className="text-center text-muted-foreground">No live classes available</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveClasses.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-hover transition-all relative">
                    {classItem.plan_required !== "Starter" && (
                      <Badge className="absolute top-2 right-2 bg-primary text-white">
                        {classItem.plan_required} Only
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{classItem.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{classItem.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.duration_minutes || 60} min
                        </div>
                        {classItem.price && <Badge variant="secondary">AED {classItem.price}</Badge>}
                      </div>
                      <Button
                        onClick={() => scheduleClass(classItem.id)}
                        className="w-full gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Class
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="download" className="space-y-6">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading classes...</div>
            ) : downloadClasses.length === 0 ? (
              <div className="text-center text-muted-foreground">No downloadable classes available</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadClasses.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-hover transition-all relative">
                    {classItem.plan_required !== "Starter" && (
                      <Badge className="absolute top-2 right-2 bg-primary text-white">
                        {classItem.plan_required} Only
                      </Badge>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{classItem.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{classItem.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.duration_minutes || 60} min
                        </div>
                        {classItem.price && <Badge variant="secondary">AED {classItem.price}</Badge>}
                      </div>
                      <Button
                        onClick={() => downloadClass(classItem.download_url)}
                        className="w-full gap-2"
                        disabled={!classItem.download_url}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
    </section>
  );
};

export default Classes;
