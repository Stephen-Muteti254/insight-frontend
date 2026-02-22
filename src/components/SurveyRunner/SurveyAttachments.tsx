import { FileText, Image, File, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SurveyAttachment } from '@/types/survey';

interface SurveyAttachmentsProps {
  attachments: SurveyAttachment[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) {
    return <Image className="h-5 w-5 text-info" />;
  }
  if (mimeType === 'application/pdf') {
    return <FileText className="h-5 w-5 text-destructive" />;
  }
  return <File className="h-5 w-5 text-muted-foreground" />;
}

export function SurveyAttachments({ attachments }: SurveyAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const handleOpenAttachment = (attachment: SurveyAttachment) => {
    // Open in new tab for viewing
    window.open(attachment.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Survey Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getFileIcon(attachment.type)}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-foreground">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOpenAttachment(attachment)}
                className="shrink-0 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View</span>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Review these materials before starting the survey (optional).
        </p>
      </CardContent>
    </Card>
  );
}
