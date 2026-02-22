import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SurveyIframeProps {
  externalUrl: string;
  title: string;
}

export function SurveyIframe({ externalUrl, title }: SurveyIframeProps) {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeError = () => {
    setIframeError(true);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleOpenInNewTab = () => {
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  // If iframe fails or URL suggests it won't embed
  if (iframeError) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-warning mx-auto" />
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                Survey Cannot Be Displayed Here
              </h3>
              <p className="text-muted-foreground mt-1">
                This survey provider doesn't allow embedding. Please open it in a new tab.
              </p>
            </div>
            <Button onClick={handleOpenInNewTab} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open Survey in New Tab
            </Button>
            <Alert className="text-left mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Keep this page open while completing the survey. Return here to confirm completion.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Loading state */}
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 z-10">
            <div className="text-center space-y-3">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading survey...</p>
            </div>
          </div>
        )}
        
        {/* Iframe */}
        <iframe
          src={externalUrl}
          title={title}
          className="w-full min-h-[80vh] border-0"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
        />
        
        {/* Fallback link */}
        <div className="p-3 bg-secondary/30 border-t flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Having trouble viewing the survey?
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenInNewTab}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
