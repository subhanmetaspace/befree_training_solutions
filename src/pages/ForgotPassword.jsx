import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { BookOpen, ArrowLeft } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = enter email, 2 = verify OTP, 3 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE = process.env.REACT_APP_API_BACKEND;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/user/forgot-password`, { email });
      toast({
        title: "OTP Sent",
        description: res.data.message,
      });
      setStep(2);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/user/verify-forgot-otp`, { email, otp });
      toast({
        title: "OTP Verified",
        description: res.data.message,
      });
      setStep(3);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/user/reset-password`, { email, otp, new_password: newPassword });
      toast({
        title: "Password Reset",
        description: res.data.message,
      });
      navigate("/auth");
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">BeFree</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1
                ? "Forgot Password"
                : step === 2
                ? "Verify OTP"
                : "Reset Password"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter your email to receive an OTP"}
              {step === 2 && `Enter the OTP sent to ${email}`}
              {step === 3 && "Enter your new password"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}

            <Button
              type="button"
              variant="ghost"
              className="w-full gap-2 mt-4"
              onClick={() => navigate("/auth")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
