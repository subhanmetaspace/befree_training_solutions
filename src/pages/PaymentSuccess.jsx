import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle2, Loader2, XCircle, ArrowRight, Download, Mail } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BACKEND;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const orderId = query.get("orderId");
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/orders/${orderId}/verify`);
        if (res.data?.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to verify payment status");
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
    const interval = setInterval(checkOrderStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 pt-24 pb-12 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const isPaid = order?.status === "paid" || order?.paymentStatus === "CAPTURED";
  const isPending = order?.status === "awaiting_payment" || order?.status === "processing";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 md:p-12 text-center">
            {isPaid ? (
              <>
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Thank you for your purchase. Your order has been confirmed.
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold mb-4">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-mono">{orderId?.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold">{order?.amount} {order?.currency || "AED"}</span>
                    </div>
                    {order?.cardBrand && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span>{order.cardBrand} ****{order.cardLastFour}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate("/my-classes")} className="gap-2">
                    Go to My Classes <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Download Receipt
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  A confirmation email has been sent to your inbox
                </p>
              </>
            ) : isPending ? (
              <>
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-12 h-12 text-yellow-600 animate-spin" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Payment Processing</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your payment is being processed. This may take a moment.
                </p>
                <p className="text-sm text-muted-foreground">
                  This page will automatically update when your payment is confirmed.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {error || "We couldn't process your payment. Please try again."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate("/plans")}>
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/help-center")}>
                    Contact Support
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
