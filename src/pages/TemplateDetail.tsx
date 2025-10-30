import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, RotateCcw, Copy, Heart, Lock, ChevronLeft } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { Template } from "@shared/schema";

export default function TemplateDetail() {
  const [, params] = useRoute("/template/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const templateId = params?.id;

  const { data: template, isLoading } = useQuery<Template>({
    queryKey: ["/api/templates", templateId],
    enabled: !!templateId,
  });

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  useEffect(() => {
    if (template) {
      setHtmlCode(template.codeHTML);
      setCssCode(template.codeCSS);
      setJsCode(template.codeJS);
    }
  }, [template]);

  const canDownload = user?.subscriptionStatus === "active" || user?.role === "admin";

  const handleReset = () => {
    if (template) {
      setHtmlCode(template.codeHTML);
      setCssCode(template.codeCSS);
      setJsCode(template.codeJS);
      toast({ title: "Code reset", description: "Template code has been restored" });
    }
  };

  const handleCopy = async (code: string, type: string) => {
    await navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${type} code copied to clipboard` });
  };

  const handleDownload = async () => {
    if (!canDownload) {
      toast({
        title: "Subscription Required",
        description: "Please subscribe to download templates",
        variant: "destructive",
      });
      setLocation("/pricing");
      return;
    }

    try {
      // Use server-side download endpoint with auth check
      const res = await apiRequest("GET", `/api/templates/${templateId}/download`, undefined);
      const downloadData = await res.json();

      const code = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${downloadData.title || 'Template'}</title>
  <style>
${downloadData.codeCSS}
  </style>
</head>
<body>
${downloadData.codeHTML}
  <script>
${downloadData.codeJS}
  </script>
</body>
</html>
      `.trim();

      const blob = new Blob([code], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${downloadData.title.toLowerCase().replace(/\s+/g, "-")}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({ title: "Downloaded!", description: "Template downloaded successfully" });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download template",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-muted-foreground">Template not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/gallery")}
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold" data-testid="text-template-title">{template.title}</h1>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" data-testid="badge-category">{template.category}</Badge>
              <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset">
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                disabled={!canDownload}
                data-testid="button-download"
              >
                {canDownload ? (
                  <>
                    <Download className="w-4 h-4 mr-1.5" />
                    Download
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1.5" />
                    Subscribe to Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)]">
        {/* Code Editor */}
        <div className="w-full lg:w-3/5 border-r border-border/40">
          <Tabs defaultValue="html" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-card/50">
              <TabsTrigger value="html" data-testid="tab-html">HTML</TabsTrigger>
              <TabsTrigger value="css" data-testid="tab-css">CSS</TabsTrigger>
              <TabsTrigger value="js" data-testid="tab-js">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="html" className="flex-1 m-0 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy(htmlCode, "HTML")}
                data-testid="button-copy-html"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Copy
              </Button>
              <Editor
                height="100%"
                defaultLanguage="html"
                value={htmlCode}
                onChange={(value) => setHtmlCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: { top: 16 },
                }}
              />
            </TabsContent>
            <TabsContent value="css" className="flex-1 m-0 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy(cssCode, "CSS")}
                data-testid="button-copy-css"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Copy
              </Button>
              <Editor
                height="100%"
                defaultLanguage="css"
                value={cssCode}
                onChange={(value) => setCssCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: { top: 16 },
                }}
              />
            </TabsContent>
            <TabsContent value="js" className="flex-1 m-0 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => handleCopy(jsCode, "JavaScript")}
                data-testid="button-copy-js"
              >
                <Copy className="w-4 h-4 mr-1.5" />
                Copy
              </Button>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={jsCode}
                onChange={(value) => setJsCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  padding: { top: 16 },
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-2/5 bg-background p-6">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <p className="text-sm text-muted-foreground">See your changes in real-time</p>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-card h-[calc(100%-4rem)]">
            <iframe
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>${cssCode}</style>
                  </head>
                  <body>
                    ${htmlCode}
                    <script>${jsCode}</script>
                  </body>
                </html>
              `}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title="Live Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
