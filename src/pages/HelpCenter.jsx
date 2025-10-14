import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

const HelpCenter = () => {
  const faqs = [
    { question: "How do I schedule a class?", answer: "Navigate to the Classes section, choose a live class, and click 'Schedule Class'. Select your preferred time slot and confirm your booking." },
    { question: "Can I download classes for offline viewing?", answer: "Yes! All classes marked as 'Download' can be downloaded for offline viewing. Simply click the download button on the class page." },
    { question: "How do I get notified about my scheduled classes?", answer: "You'll receive notifications before your scheduled classes. Make sure to enable notifications in your browser settings." },
    { question: "What if I miss a live class?", answer: "Most live classes are recorded and made available for download within 24 hours after the session ends." },
    { question: "How do I update my profile?", answer: "Click on your profile icon in the top right corner and select 'Profile Settings' to update your information." },
    { question: "Can I reschedule a class?", answer: "Yes, you can reschedule a class up to 2 hours before the scheduled time. Go to your scheduled classes and click 'Reschedule'." },
    { question: "How do I contact a teacher?", answer: "Visit the Teachers section, find your teacher's profile, and use the contact form provided on their page." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for subscription payments." },
  ];

  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How can we help?
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="max-w-3xl mx-auto animate-slide-up">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.length ? (
                  filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                      <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <p className="text-muted-foreground">No FAQs match your search.</p>
                )}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HelpCenter;
