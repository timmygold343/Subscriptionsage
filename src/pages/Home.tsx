import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Sparkles, Code2, Zap, Shield, ChevronRight } from "lucide-react";
import type { Template } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

export default function Home() {
  const { data: templates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const featuredTemplates = templates?.slice(0, 8) || [];

  return (
    <div className="min-h-screen pt-16">
      <Hero />
      
      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover perfectly crafted components organized by type
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/gallery?category=${category}`}>
              <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer text-center transition-all duration-300" data-testid={`card-category-${category.toLowerCase()}`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">{category}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Templates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-card/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Templates</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked components to jumpstart your projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/gallery">
            <Button size="lg" variant="outline" data-testid="button-view-all">
              View All Templates
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose UIVerse?</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
            <p className="text-muted-foreground">
              See components in action with real-time code editing and instant preview
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Zap className="w-7 h-7 text-chart-2" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Production Ready</h3>
            <p className="text-muted-foreground">
              All components are optimized, accessible, and ready for production use
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-chart-3" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
            <p className="text-muted-foreground">
              New components added weekly with the latest design trends and best practices
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-chart-2/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who save time with our premium components
          </p>
          <Link href="/pricing">
            <Button size="lg" data-testid="button-cta-subscribe">
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
