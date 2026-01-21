import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { AuthContext } from "../context/AuthContext";
import {
  Loader2,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Shield,
  Lock,
  Clock,
  Award,
  ChevronLeft,
  User,
  MapPin,
  Globe,
  Wallet,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BACKEND;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

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

const SecurityBadge = () => (
  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
    <Lock className="w-4 h-4 text-green-600" />
    <span className="text-sm text-green-700 font-medium">256-bit SSL Encrypted Payment</span>
  </div>
);

const CardIcons = () => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
    <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center">
      <div className="w-3 h-3 bg-red-600 rounded-full opacity-80"></div>
      <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
    </div>
    <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
  </div>
);

const FormSection = ({ title, icon: Icon, children }) => (
  <Card className="overflow-hidden">
    <div className="bg-gradient-to-r from-muted/80 to-muted/40 px-6 py-4 border-b flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </Card>
);

const PaymentPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const { token } = useContext(AuthContext);

  const planId = query.get("planId");
  const billing = query.get("billing") || "month";
  const quantity = Number(query.get("quantity")) || 1;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  const billingSameAsContact = true;

  useEffect(() => {
    if (!planId) return navigate("/plans");
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/plans/get/${encodeURIComponent(planId)}`);
        if (res.data?.success) setPlan(res.data.data);
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

  const handleContactChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleCardChange = (e) => {
    let value = e.target.value;
    
    if (e.target.name === "cardNumber") {
      value = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    } else if (e.target.name === "expiry") {
      value = value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
    } else if (e.target.name === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    
    setCardInfo({ ...cardInfo, [e.target.name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!contactInfo.firstName) newErrors.firstName = "First name is required";
    if (!contactInfo.lastName) newErrors.lastName = "Last name is required";
    if (!contactInfo.email) newErrors.email = "Email is required";
    if (!contactInfo.country) newErrors.country = "Country is required";
    if (!contactInfo.address1) newErrors.address1 = "Address is required";
    if (!contactInfo.city) newErrors.city = "City is required";

    if (paymentMethod === "card") {
      if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Valid card number is required";
      }
      if (!cardInfo.expiry || cardInfo.expiry.length < 5) {
        newErrors.expiry = "Valid expiry date is required";
      }
      if (!cardInfo.cvc || cardInfo.cvc.length < 3) {
        newErrors.cvc = "Valid CVC is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validateForm()) return;

    const orderData = {
      planId,
      billing,
      quantity,
      contactInfo,
      paymentMethod,
      cardInfo: paymentMethod === "card" ? {
        ...cardInfo,
        cardNumber: cardInfo.cardNumber.replace(/\s/g, "")
      } : null,
      billingAddress: billingSameAsContact ? contactInfo : contactInfo,
    };

    setCreatingOrder(true);
    try {
      const res = await axios.post(`${API_BASE}/orders`, orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.success) {
        const order = res.data.data;
        if (order.paymentUrl) window.location.href = order.paymentUrl;
        else navigate(`/payment-success?orderId=${encodeURIComponent(order.id)}`);
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Payment failed. Please try again." });
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <ProgressSteps currentStep={2} />

          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Payment Details</h1>
              </div>

              <FormSection title="Contact Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={contactInfo.firstName}
                      onChange={handleContactChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={contactInfo.lastName}
                      onChange={handleContactChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Billing Address" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      name="country"
                      value={contactInfo.country}
                      onChange={handleContactChange}
                      className={`w-full h-10 px-3 rounded-md border bg-background text-sm ${errors.country ? "border-red-500" : "border-input"}`}
                    >
                      <option value="">Select your country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address1">Street Address *</Label>
                    <Input
                      id="address1"
                      name="address1"
                      placeholder="123 Main Street"
                      value={contactInfo.address1}
                      onChange={handleContactChange}
                      className={errors.address1 ? "border-red-500" : ""}
                    />
                    {errors.address1 && <p className="text-xs text-red-500">{errors.address1}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address2">Apartment, Suite, etc. (Optional)</Label>
                    <Input
                      id="address2"
                      name="address2"
                      placeholder="Apt 4B"
                      value={contactInfo.address2}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Dubai"
                      value={contactInfo.city}
                      onChange={handleContactChange}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="Dubai"
                      value={contactInfo.state}
                      onChange={handleContactChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      placeholder="00000"
                      value={contactInfo.zip}
                      onChange={handleContactChange}
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Payment Method" icon={Wallet}>
                <div className="space-y-6">
                  {/* <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium ${paymentMethod === "card" ? "text-primary" : ""}`}>Credit / Debit Card</span>
                        </div>
                        <CardIcons />
                      </div>
                    </button>
                  </div> */}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "online"
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className={`w-5 h-5 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`font-medium ${paymentMethod === "online" ? "text-primary" : ""}`}>Online Banking</span>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="JOHN DOE"
                          value={cardInfo.cardName}
                          onChange={handleCardChange}
                          className="uppercase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
                            maxLength={19}
                          />
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date *</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardInfo.expiry}
                            onChange={handleCardChange}
                            className={errors.expiry ? "border-red-500" : ""}
                            maxLength={5}
                          />
                          {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC *</Label>
                          <div className="relative">
                            <Input
                              id="cvc"
                              name="cvc"
                              placeholder="123"
                              value={cardInfo.cvc}
                              onChange={handleCardChange}
                              className={`pl-10 ${errors.cvc ? "border-red-500" : ""}`}
                              maxLength={4}
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                          {errors.cvc && <p className="text-xs text-red-500">{errors.cvc}</p>}
                        </div>
                      </div>
                      <SecurityBadge />
                    </div>
                  )}

                  {paymentMethod === "online" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will be redirected to secure payment page to complete the transaction.
                      </p>
                    </div>
                  )}
                </div>
              </FormSection>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{plan?.name} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {billing === "month" ? "Monthly" : "Yearly"} billing
                      </p>
                      <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {billing === "year" ? yearlyTotal : monthlyTotal} AED
                      </span>
                    </div>

                    {billing === "year" && (
                      <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                        <span>Annual Discount (20%)</span>
                        <span className="font-medium">-{yearlySavings} AED</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">0 AED</span>
                    </div>
                  </div>

                  <hr />

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm text-muted-foreground">Total</span>
                      {billing === "year" && (
                        <p className="text-xs text-muted-foreground">Billed annually</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">{total} AED</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePay}
                    className="w-full h-12 text-base font-semibold mt-4"
                    size="lg"
                    disabled={creatingOrder}
                  >
                    {creatingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pay {total} AED
                      </>
                    )}
                  </Button>

                  <div className="flex flex-col items-center gap-2 pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-xs">Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-xs">30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;
