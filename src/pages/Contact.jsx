import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useToast } from "../hooks/use-toast";
import { Mail, Phone, MapPin, Loader2, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BACKEND}/support/contact`, formData);
      if (response.data.success) {
        toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({ title: "Error", description: response.data.message || "Something went wrong.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                <MessageSquare className="w-4 h-4" />
                Contact Us
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question about our IT courses or subscriptions? We're here to help — reach out and we'll respond within 24 hours.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardContent className="p-8">
                    {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                              className="bg-muted border-border focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="bg-muted border-border focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-foreground">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="e.g. Query about Web Development course"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="bg-muted border-border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-foreground">Message</Label>
                          <Textarea
                            id="message"
                            rows={6}
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            className="bg-muted border-border focus:border-primary resize-none"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full h-12 text-base font-semibold bg-primary text-background hover:bg-primary/90 glow-cyan"
                          disabled={loading}
                        >
                          {loading ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                          ) : (
                            "Send Message"
                          )}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Message Received!</h2>
                        <p className="text-muted-foreground">We'll get back to you at your email within 24 hours.</p>
                        <Button className="mt-6 bg-primary text-background" onClick={() => setSubmitted(false)}>
                          Send Another Message
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                        <a href="mailto:info.digiwebstar123@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                          info.digiwebstar123@gmail.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Phone / WhatsApp</h3>
                        <a href="tel:+918108673614" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          +91 81086 73614
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          127, K No. 1105/740,<br />
                          Jodhpur Marudhar Industrial Area,<br />
                          Road No. 6, Basni, Jodhpur,<br />
                          Rajasthan – 342005
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Support Hours</h3>
                        <p className="text-sm text-muted-foreground">Mon – Sat: 9:00 AM – 7:00 PM</p>
                        <p className="text-sm text-muted-foreground">Sunday: 10:00 AM – 4:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Quick Enquiry</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Want to talk directly about course admissions or fees? Call or WhatsApp us now!
                    </p>
                    <a href="tel:+918108673614">
                      <Button className="w-full bg-primary text-background hover:bg-primary/90 glow-cyan">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now: +91 81086 73614
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
