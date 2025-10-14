import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "19",
    description: "Perfect for getting started",
    features: [
      "Access to 100+ courses",
      "Basic course materials",
      "Community forum access",
      "Email support",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "49",
    description: "Most popular for serious learners",
    features: [
      "Access to all 500+ courses",
      "Premium course materials",
      "Priority community support",
      "Live Q&A sessions",
      "Certificates of completion",
      "Downloadable resources",
      "1-on-1 mentorship (monthly)",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    description: "For teams and organizations",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Custom learning paths",
      "Advanced analytics",
      "Dedicated account manager",
      "White-label options",
      "API access",
      "Priority support 24/7",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="plans" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed for every learner. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`p-8 bg-card relative hover:shadow-hover transition-all duration-300 ${
                plan.popular ? "border-primary border-2 scale-105" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-card-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? "bg-accent hover:bg-accent/90" 
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="lg"
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
