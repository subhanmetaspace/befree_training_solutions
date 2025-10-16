import { useContext, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { BookOpen, Menu, X, Bell, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const notificationIcons = {
  course: <Clock className="w-5 h-5 text-accent" />,
  subscription: <Clock className="w-5 h-5 text-primary" />,
  achievement: <CheckCircle className="w-5 h-5 text-green-500" />,
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleNotif = () => setNotifOpen(prev => !prev);

  // Fetch notifications
  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // backend may return _id instead of id
        const data = Array.isArray(res?.data?.data) ? res.data.data.map(n => ({ ...n, id: n.id || n._id })) : [];
        setNotifications(data);
      } catch (err) {
        console.error(err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [token]);

  // Mark notification as read
  const markAsRead = async (notifId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BACKEND}/notifications/${notifId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state immediately
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const renderNotifications = () => {
    if (!notifications || notifications.length === 0) {
      return <div className="text-center text-muted-foreground py-4">No notifications</div>;
    }

    return notifications.map(notif => (
      <div
        key={notif.id}
        onClick={() => markAsRead(notif.id)}
        className={`flex items-start gap-3 p-3 rounded-lg transition hover:bg-muted/10 ${notif.read ? '' : 'bg-accent/10 border border-accent'}`}
        style={{ cursor: "pointer" }}
      >
        {notificationIcons[notif.type] || <Clock className="w-5 h-5 text-muted-foreground" />}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">{notif.title}</span>
          <span className="text-sm text-muted-foreground">{notif.description}</span>
          <span className="text-xs text-muted-foreground">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</span>
        </div>
      </div>
    ));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div style={{ cursor: "pointer" }} onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BeFree</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Classes</a>
            <a href="/teachers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Teachers</a>
            <a href="/plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Plans</a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Help</a>
          </nav>

          {/* Desktop Buttons + Notification Bell */}
          <div className="hidden md:flex items-center gap-3 relative">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={toggleNotif}>
                <Bell className="w-5 h-5 text-foreground" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-background border border-border shadow-lg rounded-xl p-4 z-50">
                  {renderNotifications()}
                </div>
              )}
            </div>

            {token ? (
              <Button onClick={() => navigate("/profile")} size="sm" variant="ghost">Dashboard</Button>
            ) : (
              <>
                <Button onClick={() => navigate("/auth")} variant="ghost" size="sm">Sign In</Button>
                <Button onClick={() => navigate("/auth")} size="sm" className="bg-accent hover:bg-accent/90">Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu + Bell */}
          <div className="md:hidden flex items-center gap-2 relative">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={toggleNotif}>
                <Bell className="w-5 h-5 text-foreground" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 max-h-[400px] overflow-y-auto bg-background border border-border shadow-lg rounded-xl p-4 z-50">
                  {renderNotifications()}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-border flex flex-col gap-2">
            <a href="#classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Classes</a>
            <a href="#teachers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Teachers</a>
            <a href="#plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Plans</a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="/help-center" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Help</a>
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90">Get Started</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
