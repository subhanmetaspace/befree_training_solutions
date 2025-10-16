import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Classes from "../components/Classes";
import Teachers from "../components/Teachers";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        {/* <Classes /> */}
        <Teachers />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
