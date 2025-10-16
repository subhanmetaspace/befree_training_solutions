import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check } from "lucide-react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
const plans = [
  {
    name: "Starter",
    price: "100",
    description: "Ideal for individuals beginning their skill journey",
    features: [
      "Access to selected skill-based classes",
      "Connect with verified teachers",
      "Basic learning materials",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "500",
    description: "Perfect for learners seeking professional growth",
    features: [
      "Unlimited access to all skill-based classes",
      "Direct interaction with experienced teachers",
      "Advanced learning materials",
      "Weekly live sessions",
      "Priority teacher support",
      "Access to recorded sessions",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "1500",
    description: "Tailored for institutions and corporate teams",
    features: [
      "Everything in Professional",
      "Custom training programs",
      "Dedicated teaching coordinators",
      "Private group classes",
      "Performance reports and analytics",
      "Flexible scheduling",
      "24/7 dedicated support",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const fetchPlans = async ()=>{
  try{
    const response = await axios.get(`${process.env.REACT_APP_API_BACKEND}/plans/get`)
    if(response.data.success){
      setPricingPlans(response.data.data)
    }

  }catch(err){
    console.log('error',err)
  }
}
const [pricingPlans,setPricingPlans]=useState(plans)
useEffect(()=>{
  fetchPlans();
},[])
  return (
    <section id="plans" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Skill Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed for every learner. Gain practical skills and connect with expert teachers to grow at your own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
          {pricingPlans.map((plan, index) => (
            <Card
  key={index}
  className={`flex flex-col p-8 bg-card relative hover:shadow-hover transition-all duration-300 ${
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
      <span className="text-4xl font-bold text-primary">AED {plan.price}</span>
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

  {/* Push button to bottom */}
  <div className="mt-auto">
    <Button
      onClick = {()=>{
        const planId = plan.id??plan.name;
                      navigate(`/checkout?planId=${encodeURIComponent(planId)}`)
      }}
      className={`w-full ${
        plan.popular ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"
      }`}
      size="lg"
    >
      Get Started
    </Button>
  </div>
</Card>

          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
