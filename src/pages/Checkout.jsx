import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Loader2, ShoppingCart, CreditCard, CheckCircle2, Shield, Clock, Award, Minus, Plus, Trash2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BACKEND;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Cart", icon: ShoppingCart },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Confirmation", icon: CheckCircle2 },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TrustBadges = () => (
  <div className="flex flex-wrap justify-center gap-6 mt-6 pt-6 border-t">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Shield className="w-5 h-5 text-green-600" />
      <span className="text-sm">Secure Payment</span>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="w-5 h-5 text-blue-600" />
      <span className="text-sm">30-Day Guarantee</span>
    </div>
    <div className="flex items-center gap-2 text-muted-foreground">
      <Award className="w-5 h-5 text-amber-600" />
      <span className="text-sm">Quality Education</span>
    </div>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const planId = query.get("planId");
  const { token } = useContext(AuthContext);

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState("month");
  const [quantity, setQuantity] = useState(1);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return navigate("/plans");
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/plans/get/${encodeURIComponent(planId)}`);
        if (res.data?.success) setPlan(res.data.data);
        else navigate("/plans");
      } catch (err) {
        console.error(err);
        navigate("/plans");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId, navigate]);

  const basePrice = useMemo(() => {
    if (!plan?.price) return 0;
    const match = String(plan.price).match(/([\d.,]+)/);
    return match ? Number(match[1].replace(/,/g, "")) : 0;
  }, [plan]);

  const monthlyTotal = useMemo(() => basePrice * quantity, [basePrice, quantity]);
  const yearlyTotal = useMemo(() => basePrice * 12 * quantity, [basePrice, quantity]);
  const yearlySavings = useMemo(() => Math.round(monthlyTotal * 12 * 0.2), [monthlyTotal]);
  const total = billing === "year" ? yearlyTotal - yearlySavings : monthlyTotal;

  const handleProceed = async () => {
    if (!token) {
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    navigate(`/payment?planId=${encodeURIComponent(plan.id ?? plan.name)}&billing=${billing}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Plan Not Found</h2>
          <p className="text-muted-foreground mb-6">The plan you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/plans")}>Browse Plans</Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <ProgressSteps currentStep={1} />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
              </div>

              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">Selected Plan</span>
                    {plan.popular && (
                      <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                      
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-3">What's included:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.features?.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{basePrice} AED</div>
                        <div className="text-sm text-muted-foreground">/month</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => navigate("/plans")}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <hr className="my-6" />

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">Quantity:</span>
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-muted transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[50px] text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Billing:</span>
                      <div className="flex bg-muted rounded-lg p-1">
                        <button
                          onClick={() => setBilling("month")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            billing === "month"
                              ? "bg-white shadow text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBilling("year")}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            billing === "year"
                              ? "bg-white shadow text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Yearly
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            Save 20%
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{plan.name} Plan</span>
                    <span className="font-medium">{basePrice} AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">x {quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Billing Period</span>
                    <span className="font-medium">{billing === "month" ? "Monthly" : "Yearly"}</span>
                  </div>

                  {billing === "year" && (
                    <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                      <span>Annual Discount (20%)</span>
                      <span className="font-medium">-{yearlySavings} AED</span>
                    </div>
                  )}

                  <hr className="my-4" />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm text-muted-foreground">Total</span>
                      {billing === "year" && (
                        <p className="text-xs text-muted-foreground">Billed annually</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">{total} AED</span>
                      {billing === "month" && (
                        <p className="text-xs text-muted-foreground">/month</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full mt-4 h-12 text-base font-semibold"
                    size="lg"
                    disabled={creatingOrder}
                  >
                    {creatingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Continue to Payment
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By continuing, you agree to our Terms of Service
                  </p>
                </div>

                <TrustBadges />
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
