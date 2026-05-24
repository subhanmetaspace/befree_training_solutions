import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check, Zap, Star } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const plans = [
  {
    name: "Starter",
    price: "20000",
    description: "Perfect to get started with IT skills and explore courses",
    features: [
      "Access to 50+ beginner IT courses",
      "Recorded video lectures",
      "Basic coding assignments",
      "Community forum access",
      "Course completion certificate",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "100000",
    description: "For serious learners aiming for IT jobs and freelancing",
    features: [
      "Unlimited access to all 200+ IT courses",
      "Live classes with expert instructors",
      "1-on-1 mentorship sessions",
      "Real-world project assignments",
      "Industry-recognized certificates",
      "Job placement assistance",
      "Priority support (WhatsApp & email)",
      "Recorded sessions replay",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "250000",
    description: "For teams, institutes, and corporate IT training needs",
    features: [
      "Everything in Professional",
      "Custom corporate training programs",
      "Dedicated account manager",
      "Bulk team enrollment",
      "Progress tracking dashboard",
      "Custom certificates with company branding",
      "API & LMS integration support",
      "24/7 dedicated support",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [pricingPlans, setPricingPlans] = useState(plans);
  const [billing, setBilling] = useState("month");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/plans/get`);
        if (response.data.success && response.data.data?.length) {
          setPricingPlans(response.data.data);
        }
      } catch (err) {
        console.log('Using default plans');
      }
    };
    fetchPlans();
  }, []);

  const getDisplayPrice = (plan) => {
    const base = Number(plan.price);
    if (billing === "year") {
      return Math.round(base * 12 * 0.8);
    }
    return base;
  };

  return (
    <section id="plans" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Subscription Plans
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Invest in Your{" "}
            <span className="text-gradient">IT Future</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed for every stage of your IT career. Cancel anytime.
          </p>

          <div className="inline-flex items-center mt-8 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setBilling("month")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === "month" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("year")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${billing === "year" ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col p-8 relative transition-all duration-300 ${
                plan.popular
                  ? "border-primary border-2 bg-primary/5 glow-cyan scale-105"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-background text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-card-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="flex items-baseline mt-4">
                  <span className="text-4xl font-bold text-primary">₹{getDisplayPrice(plan).toLocaleString('en-IN')}</span>
                  <span className="text-muted-foreground ml-2 text-sm">/{billing === "year" ? "year" : "month"}</span>
                </div>
                {billing === "year" && (
                  <p className="text-green-400 text-xs mt-1">Save ₹{Math.round(Number(plan.price) * 12 * 0.2).toLocaleString('en-IN')} annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-card-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  onClick={() => {
                    const planId = plan.id ?? plan.name;
                    navigate(`/checkout?planId=${encodeURIComponent(planId)}`);
                  }}
                  className={`w-full h-11 font-semibold ${
                    plan.popular
                      ? "bg-primary text-background hover:bg-primary/90 glow-cyan"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                  size="lg"
                >
                  {plan.popular ? "Get Started Now" : "Choose Plan"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 7-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
