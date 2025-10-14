import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const MyClasses = () => {
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Replace this with your own auth user object
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    // TODO: Replace this with your own auth check
    const loggedInUser = null; // Replace with your API/auth logic
    if (!loggedInUser) {
      navigate("/auth");
    } else {
      setUser(loggedInUser);
      fetchScheduledClasses(loggedInUser?.id);
    }
  };

  const fetchScheduledClasses = async (userId) => {
    setLoading(true);

    try {
      // TODO: Replace this with your API call
      // Example:
      // const response = await fetch(`/api/classes?userId=${userId}`);
      // const data = await response.json();
      const data = []; // Replace with API response

      setScheduledClasses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load classes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelClass = async (id) => {
    try {
      // TODO: Replace this with your API call to cancel a class
      // Example:
      // await fetch(`/api/classes/${id}`, { method: "DELETE" });

      toast({
        title: "Class cancelled",
        description: "Your scheduled class has been cancelled.",
      });

      if (user) {
        fetchScheduledClasses(user.id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel class",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-8">My Scheduled Classes</h1>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : scheduledClasses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">You don't have any scheduled classes yet.</p>
                <Button onClick={() => navigate("/")}>Browse Classes</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scheduledClasses.map((scheduled) => (
                <Card key={scheduled.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{scheduled.classes?.title}</CardTitle>
                        <CardDescription>{scheduled.classes?.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          scheduled.status === "completed"
                            ? "secondary"
                            : scheduled.status === "cancelled"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {scheduled.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-6 items-center justify-between">
                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(scheduled.scheduled_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {new Date(scheduled.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      {scheduled.status === "scheduled" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelClass(scheduled.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyClasses;
