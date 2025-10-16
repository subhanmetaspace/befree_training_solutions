
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({ show: false, requiredPlan: "" });

  const { toast } = useToast();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (!token) return navigate("/auth");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data); // expected: profile.planType or similar
      } catch (err) {
        console.error(err);
        navigate("/auth");
      }
    };

    const fetchClasses = async () => {
      // Sample classes
      const sampleClasses = [
{ id: 1, title: "Beginner Photography", description: "Learn the basics of photography.", duration_minutes: 60, price: 100, plan_required: "Starter" },
{ id: 2, title: "Creative Writing Essentials", description: "Improve your storytelling skills.", duration_minutes: 75, price: 100, plan_required: "Starter" },
{ id: 3, title: "Web Development Basics", description: "HTML, CSS, and JS fundamentals.", duration_minutes: 80, price: 100, plan_required: "Starter" },
{ id: 4, title: "Graphic Design Fundamentals", description: "Learn to create visually appealing designs.", duration_minutes: 70, price: 100, plan_required: "Starter" },
{ id: 5, title: "Social Media Marketing Basics", description: "Promote brands effectively on social media.", duration_minutes: 60, price: 100, plan_required: "Starter" },
{ id: 6, title: "Public Speaking & Presentation Skills", description: "Gain confidence in speaking to an audience.", duration_minutes: 90, price: 100, plan_required: "Starter" },
{ id: 7, title: "Advanced Photoshop Techniques", description: "Enhance your editing skills.", duration_minutes: 90, price: 500, plan_required: "Professional" },
{ id: 8, title: "Full-Stack Web Development", description: "Projects with React, Node.js, and MongoDB.", duration_minutes: 180, price: 500, plan_required: "Professional" },
{ id: 9, title: "Digital Marketing Mastery", description: "SEO, Ads, and analytics for business growth.", duration_minutes: 120, price: 500, plan_required: "Professional" },
{ id: 10, title: "Advanced Excel & Data Visualization", description: "Transform raw data into actionable insights.", duration_minutes: 100, price: 500, plan_required: "Professional" },
{ id: 11, title: "Data Analytics for Business", description: "Learn how to analyze business data.", duration_minutes: 120, price: 1500, plan_required: "Enterprise" },
{ id: 12, title: "Machine Learning Crash Course", description: "Hands-on ML projects with Python.", duration_minutes: 200, price: 1500, plan_required: "Enterprise" },
{ id: 13, title: "AI & Deep Learning Projects", description: "Implement AI solutions for real-world problems.", duration_minutes: 220, price: 1500, plan_required: "Enterprise" },
{ id: 14, title: "Cybersecurity Essentials", description: "Protect systems and networks from attacks.", duration_minutes: 180, price: 1500, plan_required: "Enterprise" },
{ id: 15, title: "Advanced Project Management", description: "Plan and execute complex projects successfully.", duration_minutes: 160, price: 1500, plan_required: "Enterprise" },
];
      setClasses(sampleClasses);
    };

    fetchProfile();
    fetchClasses();
  }, [token, navigate]);

  const openEnrollModal = () => setShowEnrollModal(true);
  const closeEnrollModal = () => setShowEnrollModal(false);

  const enrollClass = (cls) => {
    if (!profile) return;

    const planHierarchy = { Starter: 1, Professional: 2, Enterprise: 3 };
    const userPlanLevel = planHierarchy[profile.planType] || 0;
    const classPlanLevel = planHierarchy[cls.plan_required] || 0;

    if (classPlanLevel > userPlanLevel) {
      // Show upgrade modal
      setUpgradeModal({ show: true, requiredPlan: cls.plan_required });
      return;
    }

    // Otherwise show normal enroll modal
    openEnrollModal();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Available Classes</h1>

          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground">No classes available</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card 
                  key={cls.id} 
                  className={`hover:shadow-lg transition-all relative ${
                    cls.plan_required === "Professional" ? "scale-105 border border-blue-600" : ""} 
                    ${cls.plan_required === "Enterprise" ? "scale-105 border border-red-600" : ""}`}
                >
                  {cls.plan_required !== "Starter" && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-sm font-semibold
                      ${cls.plan_required === "Professional" ? "bg-blue-600" : "bg-red-600"}`}>
                      {cls.plan_required} Only
                    </div>
                  )}

                  <CardHeader className="pt-6">
                    <CardTitle>{cls.title}</CardTitle>
                    <CardDescription>{cls.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {cls.duration_minutes} min
                      </div>
                      {cls.price && <Badge variant="secondary">AED {cls.price}</Badge>}
                    </div>
                    <Button
                      onClick={() => enrollClass(cls)}
                      disabled={cls.enrolled || enrolling}
                      className={`w-full gap-2 ${
                        cls.plan_required === "Professional" ? "bg-blue-600 hover:bg-blue-700" :
                        cls.plan_required === "Enterprise" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
                      }`}
                    >
                      {cls.enrolled ? "Enrolled" : "Enroll"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Normal Enroll Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h2 className="text-xl font-bold mb-4">Enroll in Class</h2>
              <p className="mb-6">Do you want to enroll in this class?</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeEnrollModal}>Cancel</Button>
                <Button
                  onClick={() => {
                    closeEnrollModal();
                    toast({ title: "Enrolled", description: "You have successfully enrolled!" });
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Plan Modal */}
        {upgradeModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
              <h2 className="text-xl font-bold mb-4">Upgrade Required</h2>
              <p className="mb-6">
                This class requires the <strong>{upgradeModal.requiredPlan}</strong> plan. Would you like to upgrade your plan?
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setUpgradeModal({ show: false, requiredPlan: "" })}>Cancel</Button>
                <Button onClick={() => navigate("/plans")}>Confirm</Button>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
};

export default ClassesPage;
