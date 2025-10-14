import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Download, Video, Calendar, Clock } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // TODO: Replace with your API call
      // Example:
      // const response = await fetch("/api/classes");
      // const data = await response.json();
      const data = [
        // sample data structure
        {
          id: 1,
          title: "Sample Live Class",
          description: "Learn something amazing",
          duration_minutes: 60,
          type: "live",
          price: 20,
        },
        {
          id: 2,
          title: "Sample Downloadable Class",
          description: "Download and learn",
          duration_minutes: 45,
          type: "download",
          price: 10,
          download_url: "#",
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
            Choose from downloadable content or join live interactive sessions with expert instructors
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
                  <Card key={classItem.id} className="hover:shadow-hover transition-all">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{classItem.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {classItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.duration_minutes || 60} min
                        </div>
                        {classItem.price && <Badge variant="secondary">${classItem.price}</Badge>}
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
                  <Card key={classItem.id} className="hover:shadow-hover transition-all">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{classItem.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {classItem.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {classItem.duration_minutes || 60} min
                        </div>
                        {classItem.price && <Badge variant="secondary">${classItem.price}</Badge>}
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
