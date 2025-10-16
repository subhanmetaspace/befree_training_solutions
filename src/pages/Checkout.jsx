// src/pages/Checkout.jsx
import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_BACKEND;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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

  // Fetch plan details
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return navigate("/pricing");
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/plans/get/${encodeURIComponent(planId)}`);
        if (res.data?.success) setPlan(res.data.data);
        else navigate("/pricing");
      } catch (err) {
        console.error(err);
        navigate("/pricing");
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

  const total = useMemo(
    () => (billing === "year" ? basePrice * 12 * quantity : basePrice * quantity),
    [basePrice, billing, quantity]
  );

  const handleProceed = async () => {
    if (!token) {
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }else{
        navigate(`/payment?planId=${encodeURIComponent(plan.id)}&billing=${billing}&quantity=${quantity}`)
    }

    setCreatingOrder(true);
    try {
      const res = await axios.post(
        `${API_BASE}/orders`,
        { planId: plan.id ?? plan.name, billing, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        const order = res.data.data;
        if (order.paymentUrl) window.location.href = order.paymentUrl;
        else navigate(`/payment?orderId=${encodeURIComponent(order.id)}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (!plan)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        Plan not found.
      </div>
    );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-3 gap-8">
          
          {/* Left Column: Cart */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Your Cart</h2>
            
            <div className="bg-card rounded-lg shadow p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-semibold text-card-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    Billing: {billing === "month" ? "Monthly" : "Yearly"}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-card-foreground">
                    {plan.features.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{total} AED</div>
                </div>
              </div>

              {/* Quantity & Billing Selection */}
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2">
                  Quantity:
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={billing === "month" ? "default" : "outline"}
                    onClick={() => setBilling("month")}
                  >
                    Monthly
                  </Button>
                  <Button
                    size="sm"
                    variant={billing === "year" ? "default" : "outline"}
                    onClick={() => setBilling("year")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Order Summary</h2>
            <div className="bg-card rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{total} AED</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Savings</span>
                <span>-0 AED</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>0 AED</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg font-bold text-card-foreground">
                <span>Today's Total</span>
                <span>{total} AED</span>
              </div>

              <Button
                onClick={handleProceed}
                className="w-full mt-2"
                size="lg"
                disabled={creatingOrder}
              >
                {creatingOrder ? "Processing..." : "Continue to Checkout"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                30-day money-back guarantee
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
