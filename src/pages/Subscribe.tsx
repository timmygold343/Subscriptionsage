import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Crown, Check, ArrowLeft } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import PayPalButton from "@/components/PayPalButton";

function PaystackPaymentWrapper({ plan, onSuccess }: { plan: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePaystackPayment = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/paystack/initialize", { plan });
      const data = await response.json();

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Click the button below to complete your {plan} subscription payment
        </p>
        <p className="text-2xl font-bold text-center mt-2">
          {plan === "yearly" ? "$79.00" : "$9.00"}
        </p>
      </div>

      <Button
        onClick={handlePaystackPayment}
        className="w-full"
        size="lg"
        disabled={isLoading}
        data-testid="button-paystack-pay"
      >
        {isLoading ? "Redirecting..." : `Pay with Paystack`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You'll be redirected to Paystack's secure payment page
      </p>
    </div>
  );
}

function PayPalPaymentWrapper({ plan, onSuccess }: { plan: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const amount = plan === "yearly" ? "79.00" : "9.00";

  const handleSuccess = async (data: any) => {
    try {
      await apiRequest("POST", "/api/subscription/update", {
        subscriptionStatus: "active",
        subscriptionProvider: "paypal",
        subscriptionPlan: plan,
      });

      toast({
        title: "Payment Successful!",
        description: `You are now subscribed to the ${plan} plan`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const handleError = (error: any) => {
    toast({
      title: "Payment Failed",
      description: "PayPal payment was not completed",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Click the PayPal button below to complete your {plan} subscription
        </p>
        <p className="text-2xl font-bold text-center mt-2">
          {plan === "yearly" ? "$79.00" : "$9.00"}
        </p>
      </div>

      <div className="flex justify-center">
        <PayPalButton
          amount={amount}
          currency="USD"
          intent="CAPTURE"
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment processed by PayPal
      </p>
    </div>
  );
}

export default function Subscribe() {
  const [, params] = useRoute("/subscribe");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get("plan") || "monthly";
  const plan = planParam === "yearly" ? "yearly" : "monthly";

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const handleSuccess = () => {
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  if (!user) {
    return null;
  }

  const planDetails = {
    monthly: {
      name: "Monthly Plan",
      price: "$9",
      period: "per month",
      features: [
        "Download all templates",
        "Full code access",
        "Monaco editor",
        "Priority support",
        "Cancel anytime",
      ],
    },
    yearly: {
      name: "Yearly Plan",
      price: "$79",
      period: "per year",
      savings: "Save $29 per year",
      features: [
        "Everything in Monthly",
        "Save 30% annually",
        "Early access to new templates",
        "Exclusive components",
        "Premium support",
      ],
    },
  };

  const selectedPlan = planDetails[plan];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/pricing")}
          className="mb-6"
          data-testid="button-back-pricing"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pricing
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Subscribe to {selectedPlan.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  Choose your preferred payment method
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{selectedPlan.price}</div>
                <div className="text-sm text-muted-foreground">{selectedPlan.period}</div>
                {'savings' in selectedPlan && selectedPlan.savings && (
                  <Badge variant="secondary" className="mt-1">
                    {selectedPlan.savings}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">What's included:</h3>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Tabs defaultValue="paystack" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paystack" data-testid="tab-paystack">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="paypal" data-testid="tab-paypal">
                  <SiPaypal className="w-4 h-4 mr-2" />
                  PayPal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paystack" className="mt-6">
                <PaystackPaymentWrapper plan={plan} onSuccess={handleSuccess} />
              </TabsContent>

              <TabsContent value="paypal" className="mt-6">
                <PayPalPaymentWrapper plan={plan} onSuccess={handleSuccess} />
              </TabsContent>
            </Tabs>

            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
              You can cancel your subscription at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
