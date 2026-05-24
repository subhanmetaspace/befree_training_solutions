
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, Lock } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

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

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [enrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({ show: false, requiredPlan: "" });
  const [loginModal, setLoginModal] = useState(false);

  const { toast } = useToast();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setClasses(sampleClasses);

    // Only fetch profile if user is already logged in
    if (token) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(res.data);
        } catch (err) {
          console.error("Profile fetch error:", err);
        }
      };
      fetchProfile();
    }
  }, [token]);

  const planHierarchy = { Starter: 1, Professional: 2, Enterprise: 3 };

  const enrollClass = (cls) => {
    // Not logged in — prompt login
    if (!token) {
      setLoginModal(true);
      return;
    }

    const userPlanLevel = planHierarchy[profile?.data?.name] || 0;
    const classPlanLevel = planHierarchy[cls.plan_required] || 0;

    if (classPlanLevel > userPlanLevel) {
      setUpgradeModal({ show: true, requiredPlan: cls.plan_required });
      return;
    }

    setShowEnrollModal(true);
  };

  const planColor = {
    Starter: "bg-primary",
    Professional: "bg-blue-600",
    Enterprise: "bg-purple-600",
  };

  const buttonColor = {
    Starter: "bg-primary hover:bg-primary/90",
    Professional: "bg-blue-600 hover:bg-blue-700",
    Enterprise: "bg-purple-600 hover:bg-purple-700",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-6">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Explore Our <span className="text-primary">Courses</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse all available IT courses. Sign in and subscribe to start learning.
            </p>
          </div>

          {/* Plan legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {["Starter", "Professional", "Enterprise"].map((plan) => (
              <span key={plan} className={`${planColor[plan]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {plan} Plan
              </span>
            ))}
          </div>

          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground">No courses available</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="hover:shadow-lg transition-all relative border border-border"
                >
                  <div className={`absolute top-3 right-3 ${planColor[cls.plan_required]} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
                    {cls.plan_required}
                  </div>

                  <CardHeader className="pt-6 pr-20">
                    <CardTitle className="text-base">{cls.title}</CardTitle>
                    <CardDescription>{cls.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {cls.duration_minutes} min
                      </div>
                      {cls.price && (
                        <Badge variant="secondary">₹{Number(cls.price).toLocaleString("en-IN")}</Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => enrollClass(cls)}
                      disabled={enrolling}
                      className={`w-full gap-2 ${buttonColor[cls.plan_required]}`}
                    >
                      {!token && <Lock className="w-4 h-4" />}
                      {cls.enrolled ? "Enrolled" : "Enroll Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Login required modal */}
        {loginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-xl shadow-xl max-w-sm w-full p-6 text-center border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to your account to enroll in this course.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setLoginModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate(`/auth?redirect=${encodeURIComponent("/classes")}`)}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Normal Enroll Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-xl shadow-xl max-w-sm w-full p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Enroll in Course</h2>
              <p className="text-muted-foreground mb-6">Do you want to enroll in this course?</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEnrollModal(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    setShowEnrollModal(false);
                    toast({ title: "Enrolled!", description: "You have successfully enrolled in this course." });
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-xl shadow-xl max-w-sm w-full p-6 text-center border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Plan Upgrade Required</h2>
              <p className="text-muted-foreground mb-6">
                This course requires the <strong className="text-primary">{upgradeModal.requiredPlan}</strong> plan.
                Would you like to upgrade your plan?
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => setUpgradeModal({ show: false, requiredPlan: "" })}>
                  Cancel
                </Button>
                <Button onClick={() => navigate("/plans")}>View Plans</Button>
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
