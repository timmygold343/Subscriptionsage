import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Calendar, CreditCard, Package, Sparkles } from "lucide-react";
import type { Template } from "@shared/schema";
import { TemplateCard } from "@/components/TemplateCard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: templates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: favorites } = useQuery<Template[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  // Handle auth redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSubscribed = user.subscriptionStatus === "active";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isSubscribed ? (
                  <Badge className="text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    {user.subscriptionPlan === "yearly" ? "Yearly" : "Monthly"} Subscriber
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Free Account</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isSubscribed ? "Full access to all templates" : "Limited access"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-template-count">
                {templates?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Premium UI components
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-favorites-count">
                {favorites?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Saved templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription CTA */}
        {!isSubscribed && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-chart-2/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
                  <p className="text-muted-foreground">
                    Get unlimited access to all templates with downloadable source code
                  </p>
                </div>
                <Link href="/pricing">
                  <Button size="lg" data-testid="button-upgrade">
                    <Crown className="mr-2 h-5 w-5" />
                    View Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg" data-testid="text-username">{user.username}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-email">{user.email}</p>
              </div>
            </div>
            
            {isSubscribed && (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subscription Plan</span>
                  <Badge data-testid="badge-plan">
                    {user.subscriptionPlan === "yearly" ? "Yearly" : "Monthly"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Provider</span>
                  <span className="text-sm font-medium capitalize" data-testid="text-provider">
                    {user.subscriptionProvider || "N/A"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites Section */}
        {favorites && favorites.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
