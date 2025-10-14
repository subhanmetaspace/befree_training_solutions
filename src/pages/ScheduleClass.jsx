import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Calendar } from "../components/ui/calendar";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

const ScheduleClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [classDetails, setClassDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ id: "demo-user" }); // Replace with your auth user info

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      // Replace with your API endpoint
      const res = await fetch(`/api/classes/${classId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load class details");
      setClassDetails(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00"
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !user) {
      toast({
        title: "Missing information",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Replace with your API endpoint
      const res = await fetch("/api/schedule-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          class_id: classId,
          scheduled_at: scheduledDateTime.toISOString(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to schedule class",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Class scheduled!",
          description: "You'll receive a notification before the class starts.",
        });
        navigate("/my-classes");
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule class",
        variant: "destructive",
      });
    }
  };

  if (!classDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{classDetails.title}</CardTitle>
                <CardDescription>{classDetails.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{classDetails.duration_minutes || 60} minutes</span>
                  </div>
                  {classDetails.price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${classDetails.price}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border mt-2"
                  />
                </div>

                <div>
                  <Label>Time</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime || loading}
                  className="w-full"
                >
                  {loading ? "Scheduling..." : "Confirm Schedule"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScheduleClass;
