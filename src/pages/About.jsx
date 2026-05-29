import Header from "../components/Header";
import Footer from "../components/Footer";
import { Code2, Target, Award, Heart, Users, Zap, MapPin, Globe } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Code2,
      title: "Industry-Ready Skills",
      description: "Every course is designed with current industry requirements. We teach what employers actually hire for.",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      icon: Target,
      title: "Practical Learning",
      description: "Real projects, live coding sessions, and hands-on labs — not just theory. Build a portfolio employers love.",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      icon: Award,
      title: "Certified Excellence",
      description: "Industry-recognized certificates from Digiweb Star that carry weight with top IT companies across India.",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      icon: Heart,
      title: "Student-First Culture",
      description: "From doubt-clearing to career support, we are with every student until they land the job they deserve.",
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
  ];

  const stats = [
    { label: "Students Trained", value: "15,000+", icon: Users },
    { label: "IT Courses", value: "200+", icon: Code2 },
    { label: "Placement Rate", value: "95%", icon: Zap },
    { label: "Cities Reached", value: "50+", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
                <Code2 className="w-4 h-4" />
                About Digiweb Star
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Building India's Next{" "}
                <span className="text-gradient">IT Workforce</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Digiweb Star Solution Pvt Ltd is a Jodhpur-based IT training institute on a mission to equip every aspiring tech professional with industry-ready digital skills — through live classes, recorded courses, and real-world mentorship.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 animate-slide-up">
              <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/30 transition-colors">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-primary" />
                  Our Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Founded in Jodhpur, Rajasthan, Digiweb Star Solution Pvt Ltd was born from a simple belief — that quality IT education should not be limited to metro cities. We started with a small batch of 20 students and have grown to serve 15,000+ learners across India. Our courses cover Web Development, Python, Digital Marketing, Data Science, Cloud Computing, Cybersecurity, and more.
                </p>
              </div>
              <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/30 transition-colors">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We are on a mission to democratize IT education in India. Through our online learning platform at learnwithdigiweb.com, students from Tier 2 and Tier 3 cities can now access the same quality of IT training as those in metros — at a fraction of the cost, with expert instructors, live classes, and job placement support.
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Our <span className="text-gradient">Core Values</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-hover transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-4`}>
                      <value.icon className={`w-6 h-6 ${value.color}`} />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-8 hover:border-primary/30 transition-colors">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Find Us
              </h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Registered Address</p>
                  <p className="leading-relaxed">
                    127, K No. 1105/740,<br />
                    Jodhpur Marudhar Industrial Area,<br />
                    Sub Post Office, Road No. 6,<br />
                    Basni, Jodhpur, Rajasthan – 342005
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Contact</p>
                  <p>📧 info.digiwebstar123@gmail.com</p>
                  <p className="mt-1">📞 +91 97690 14231</p>
                  <p className="mt-1">🌐 learnwithdigiweb.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
