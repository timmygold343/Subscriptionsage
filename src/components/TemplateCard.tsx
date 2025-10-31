import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Lock, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Template } from "@/lib/schema";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const { user } = useAuth();
  const canDownload = user?.subscriptionStatus === "active" || user?.role === "admin";

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300 hover:shadow-lg" data-testid={`card-template-${template.id}`}>
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-chart-2/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    ${template.codeCSS}
                    /* Override for card preview */
                    html, body {
                      overflow: hidden;
                    }
                  </style>
                </head>
                <body>
                  ${template.codeHTML}
                  <script>${template.codeJS}</script>
                </body>
              </html>
            `}
            className="w-full h-full border-0 pointer-events-none scale-[0.6]"
            sandbox="allow-scripts"
            title={`Preview of ${template.title}`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/template/${template.id}`}>
            <Button size="sm" variant="secondary" data-testid={`button-preview-${template.id}`}>
              <Eye className="w-4 h-4 mr-1.5" />
              Preview
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid={`text-title-${template.id}`}>
              {template.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {template.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${template.id}`}>
            {template.category}
          </Badge>
          
          {canDownload ? (
            <Button size="sm" variant="ghost" data-testid={`button-download-${template.id}`}>
              <Download className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" variant="ghost" disabled data-testid={`button-locked-${template.id}`}>
              <Lock className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
