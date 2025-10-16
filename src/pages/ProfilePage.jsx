import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Loader2, User, LogOut } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { token, clearToken } = useContext(AuthContext);

  // Fetch profile
  useEffect(() => {
    if (!token) return navigate("/auth");

    const fetchProfileData = async () => {
      setLoadingProfile(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response?.data?.success) {
          setProfile(response.data.data);
        } else {
          toast({ title: "Error", description: "Unable to fetch profile data", variant: "destructive" });
          clearToken();
          navigate("/auth");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Something went wrong.",
          variant: "destructive",
        });
        clearToken();
        navigate("/auth");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [token, navigate]);

  // Logout handlers
  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout =async () => { 
    try{
      const res = await axios.post(`${process.env.REACT_APP_API_BACKEND}/user/logout`,{},{headers:{Authorization:`Bearer ${token}`}})
    if(res?.data?.success){
      clearToken(); navigate("/auth");
    }else{
      clearToken(); navigate("/auth");
    }
    }catch(err){
      console.log(err)
      clearToken(); navigate('/auth')
    }
   };
  const cancelLogout = () => setShowLogoutModal(false);

  // Modals handlers


  const openScheduleModal = () => setShowScheduleModal(true);
  const closeScheduleModal = () => setShowScheduleModal(false);

  if (loadingProfile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Details of your account</CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg font-medium">{profile?.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-medium">{profile?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-lg font-medium">{new Date(profile?.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Plan</label>
                <p className="text-lg font-medium">{profile?.name}</p>
              </div>
            </CardContent>

            {/* Action Buttons */}
            <CardContent className="flex gap-4 mt-2">
              <Button onClick={()=>{navigate("/classes")}}>Enroll Class</Button>
              <Button onClick={openScheduleModal} variant="outline">Schedule Class</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Enroll Modal */}
      

      {/* Schedule Class Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Class</h2>
            <p className="mb-6">To schedule a class, you need to purchase a plan.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeScheduleModal}>Cancel</Button>
              <Button
                onClick={() => {
                  closeScheduleModal();
                  navigate("/plans")
                }}
              >
                Purchase Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-xl font-bold mb-4">Logout Confirmation</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelLogout}>Cancel</Button>
              <Button variant="destructive" onClick={confirmLogout}>Logout</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProfilePage;
