import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Code2, User, LogOut, LayoutDashboard, Crown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" data-testid="link-home">
              <button className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md">
                <Code2 className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  UIVerse
                </span>
              </button>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link href="/gallery" data-testid="link-gallery">
                <Button variant="ghost" size="sm" className={location === "/gallery" ? "bg-accent" : ""}>
                  Templates
                </Button>
              </Link>
              <Link href="/pricing" data-testid="link-pricing">
                <Button variant="ghost" size="sm" className={location === "/pricing" ? "bg-accent" : ""}>
                  Pricing
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" data-testid="link-dashboard">
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" data-testid="link-admin">
                        <div className="flex items-center gap-2 w-full cursor-pointer">
                          <Crown className="w-4 h-4" />
                          Admin Panel
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.subscriptionStatus === "active" && (
                    <div className="px-2 py-1.5">
                      <Badge variant="default" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        {user.subscriptionPlan === "yearly" ? "Yearly" : "Monthly"} Subscriber
                      </Badge>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup" data-testid="link-signup">
                  <Button size="sm" data-testid="button-signup">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
