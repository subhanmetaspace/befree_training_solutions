// src/pages/PaymentPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BACKEND;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const countries =  [
	"Afghanistan",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antarctica",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas (the)",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia (Plurinational State of)",
	"Bonaire, Sint Eustatius and Saba",
	"Bosnia and Herzegovina",
	"Botswana",
	"Bouvet Island",
	"Brazil",
	"British Indian Ocean Territory (the)",
	"Brunei Darussalam",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cayman Islands (the)",
	"Central African Republic (the)",
	"Chad",
	"Chile",
	"China",
	"Christmas Island",
	"Cocos (Keeling) Islands (the)",
	"Colombia",
	"Comoros (the)",
	"Congo (the Democratic Republic of the)",
	"Congo (the)",
	"Cook Islands (the)",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Côte d'Ivoire",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic (the)",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Falkland Islands (the) [Malvinas]",
	"Faroe Islands (the)",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"French Southern Territories (the)",
	"Gabon",
	"Gambia (the)",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Heard Island and McDonald Islands",
	"Holy See (the)",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran (Islamic Republic of)",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea (the Democratic People's Republic of)",
	"Korea (the Republic of)",
	"Kuwait",
	"Kyrgyzstan",
	"Lao People's Democratic Republic (the)",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands (the)",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia (Federated States of)",
	"Moldova (the Republic of)",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands (the)",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger (the)",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"Northern Mariana Islands (the)",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine, State of",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines (the)",
	"Pitcairn",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Republic of North Macedonia",
	"Romania",
	"Russian Federation (the)",
	"Rwanda",
	"Réunion",
	"Saint Barthélemy",
	"Saint Helena, Ascension and Tristan da Cunha",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Martin (French part)",
	"Saint Pierre and Miquelon",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten (Dutch part)",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Georgia and the South Sandwich Islands",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan (the)",
	"Suriname",
	"Svalbard and Jan Mayen",
	"Sweden",
	"Switzerland",
	"Syrian Arab Republic",
	"Taiwan",
	"Tajikistan",
	"Tanzania, United Republic of",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks and Caicos Islands (the)",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates (the)",
	"United Kingdom of Great Britain and Northern Ireland (the)",
	"United States Minor Outlying Islands (the)",
	"United States of America (the)",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela (Bolivarian Republic of)",
	"Viet Nam",
	"Virgin Islands (British)",
	"Virgin Islands (U.S.)",
	"Wallis and Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe",
	"Åland Islands"
];
const PaymentPage = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const planId = query.get("planId");
  const billing = query.get("billing") || "month";
  const quantity = Number(query.get("quantity")) || 1;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

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

  const [paymentMethod, setPaymentMethod] = useState("card"); // card or online
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [billingSameAsAccount, setBillingSameAsAccount] = useState(true);
  const [billingAddress, setBillingAddress] = useState({ ...contactInfo });

  // Fetch plan details
  useEffect(() => {
    if (!planId) return navigate("/pricing");
    const fetchPlan = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/plans/get/${encodeURIComponent(planId)}`);
        if (res.data?.success) setPlan(res.data.data);
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

  const handleContactChange = (e) => setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  const handleBillingChange = (e) => setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });

  const handlePay = async () => {
    const orderData = {
      planId,
      billing,
      quantity,
      contactInfo,
      paymentMethod,
      cardInfo: paymentMethod === "card" ? cardInfo : null,
      billingAddress: billingSameAsAccount ? contactInfo : billingAddress,
    };

    setCreatingOrder(true);
    try {
      const res = await axios.post(`${API_BASE}/orders`, orderData);
      if (res.data?.success) {
        const order = res.data.data;
        if (order.paymentUrl) window.location.href = order.paymentUrl;
        else navigate(`/payment-success?orderId=${encodeURIComponent(order.id)}`);
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

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-3 gap-8">

          {/* Left Column: Payment Form */}
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {/* Contact Info */}
            <section className="bg-card rounded-lg shadow p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input type="text" name="firstName" placeholder="First Name" value={contactInfo.firstName} onChange={handleContactChange} className="border rounded px-3 py-2 w-full"/>
                <input type="text" name="lastName" placeholder="Last Name" value={contactInfo.lastName} onChange={handleContactChange} className="border rounded px-3 py-2 w-full"/>
                <select name="country" value={contactInfo.country} onChange={handleContactChange} className="border rounded px-3 py-2 w-full md:col-span-2">
                  <option value="">Select Country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" name="address1" placeholder="Address 1" value={contactInfo.address1} onChange={handleContactChange} className="border rounded px-3 py-2 w-full md:col-span-2"/>
                <input type="text" name="address2" placeholder="Address 2" value={contactInfo.address2} onChange={handleContactChange} className="border rounded px-3 py-2 w-full md:col-span-2"/>
                <input type="text" name="city" placeholder="City" value={contactInfo.city} onChange={handleContactChange} className="border rounded px-3 py-2 w-full"/>
                <input type="text" name="state" placeholder="State" value={contactInfo.state} onChange={handleContactChange} className="border rounded px-3 py-2 w-full"/>
                <input type="text" name="zip" placeholder="ZIP Code" value={contactInfo.zip} onChange={handleContactChange} className="border rounded px-3 py-2 w-full"/>
                <input type="email" name="email" placeholder="Email" value={contactInfo.email} onChange={handleContactChange} className="border rounded px-3 py-2 w-full md:col-span-2"/>
                <input type="text" name="phone" placeholder="Phone" value={contactInfo.phone} onChange={handleContactChange} className="border rounded px-3 py-2 w-full md:col-span-2"/>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-card rounded-lg shadow p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Payment</h2>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" value="card" checked={paymentMethod==="card"} onChange={e=>setPaymentMethod(e.target.value)}/> Card
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="online" checked={paymentMethod==="online"} onChange={e=>setPaymentMethod(e.target.value)}/> Online
                </label>
              </div>

              {paymentMethod==="card" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <input type="text" name="cardNumber" placeholder="Card Number" value={cardInfo.cardNumber} onChange={handleCardChange} className="border rounded px-3 py-2 md:col-span-3"/>
                  <input type="text" name="expiry" placeholder="MM/YY" value={cardInfo.expiry} onChange={handleCardChange} className="border rounded px-3 py-2"/>
                  <input type="text" name="cvc" placeholder="CVC" value={cardInfo.cvc} onChange={handleCardChange} className="border rounded px-3 py-2"/>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="bg-card rounded-lg shadow p-6 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Plan</span><span>{plan?.name}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Quantity</span><span>{quantity}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Billing</span><span>{billing==="month"?"Monthly":"Yearly"}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span><span>{total} AED</span>
              </div>
              <Button onClick={handlePay} className="w-full mt-2">{creatingOrder ? "Processing..." : "Pay Now"}</Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentPage;
