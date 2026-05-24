import { useContext, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Code2, Menu, X, Bell, CheckCircle, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const notificationIcons = {
  course: <Clock className="w-5 h-5 text-primary" />,
  subscription: <Clock className="w-5 h-5 text-accent" />,
  achievement: <CheckCircle className="w-5 h-5 text-green-400" />,
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleNotif = () => setNotifOpen(prev => !prev);

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BACKEND}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res?.data?.data) ? res.data.data.map(n => ({ ...n, id: n.id || n._id })) : [];
        setNotifications(data);
      } catch (err) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [token]);

  const markAsRead = async (notifId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BACKEND}/notifications/${notifId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const renderNotifications = () => {
    if (!notifications || notifications.length === 0) {
      return <div className="text-center text-muted-foreground py-4 text-sm">No notifications</div>;
    }
    return notifications.map(notif => (
      <div
        key={notif.id}
        onClick={() => markAsRead(notif.id)}
        className={`flex items-start gap-3 p-3 rounded-lg transition hover:bg-muted/30 cursor-pointer ${notif.read ? '' : 'bg-primary/10 border border-primary/30'}`}
      >
        {notificationIcons[notif.type] || <Clock className="w-5 h-5 text-muted-foreground" />}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-sm">{notif.title}</span>
          <span className="text-xs text-muted-foreground">{notif.description}</span>
          <span className="text-xs text-muted-foreground">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}</span>
        </div>
      </div>
    ));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div style={{ cursor: "pointer" }} onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-cyan">
              <Code2 className="w-6 h-6 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground leading-tight">Digiweb Star</span>
              <span className="text-xs text-primary leading-tight font-medium">Solution Pvt Ltd</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/classes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Courses</a>
            <a href="/teachers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Instructors</a>
            <a href="/plans" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Plans</a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
            <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-3 relative">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={toggleNotif} className="hover:text-primary">
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                )}
              </Button>
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card border border-border shadow-lg rounded-xl p-4 z-50">
                  {renderNotifications()}
                </div>
              )}
            </div>
            {token ? (
              <Button onClick={() => navigate("/profile")} size="sm" variant="ghost" className="hover:text-primary">Dashboard</Button>
            ) : (
              <>
                <Button onClick={() => navigate("/auth")} variant="ghost" size="sm" className="hover:text-primary">Sign In</Button>
                <Button onClick={() => navigate("/auth")} size="sm" className="bg-primary text-background hover:bg-primary/90 glow-cyan">
                  <Zap className="w-4 h-4 mr-1" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2 relative">
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={toggleNotif} className="hover:text-primary">
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                )}
              </Button>
              {notifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 max-h-[400px] overflow-y-auto bg-card border border-border shadow-lg rounded-xl p-4 z-50">
                  {renderNotifications()}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="hover:text-primary">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-border flex flex-col gap-3 pt-3">
            <a href="/classes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Courses</a>
            <a href="/teachers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Instructors</a>
            <a href="/plans" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Plans</a>
            <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</a>
            <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
            <div className="flex flex-col gap-2 mt-2">
              {token ? (
                <Button onClick={() => navigate("/profile")} size="sm" className="bg-primary text-background">Dashboard</Button>
              ) : (
                <>
                  <Button onClick={() => navigate("/auth")} variant="ghost" size="sm">Sign In</Button>
                  <Button onClick={() => navigate("/auth")} size="sm" className="bg-primary text-background hover:bg-primary/90">Get Started</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
