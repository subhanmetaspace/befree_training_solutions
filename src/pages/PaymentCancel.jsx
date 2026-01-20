import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentCancel = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const orderId = query.get("orderId");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Cancelled</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment was cancelled. No charges have been made to your account.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-2">What would you like to do?</h3>
              <ul className="text-sm text-muted-foreground text-left space-y-2">
                <li>• Return to checkout to complete your purchase</li>
                <li>• Browse our plans to find the right fit</li>
                <li>• Contact support if you experienced any issues</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/plans")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Plans
              </Button>
              <Button variant="outline" onClick={() => navigate("/help-center")} className="gap-2">
                <HelpCircle className="w-4 h-4" /> Get Help
              </Button>
            </div>

            {orderId && (
              <p className="text-xs text-muted-foreground mt-6">
                Reference: {orderId.slice(0, 8)}...
              </p>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentCancel;
