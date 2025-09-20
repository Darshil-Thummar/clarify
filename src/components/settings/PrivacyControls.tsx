import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, UserX, Trash2, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PrivacySettings {
  storageOptIn: boolean;
  redactNames: boolean;
}

interface PrivacyControlsProps {
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
  onDeleteSession: () => void;
  showInline?: boolean;
}

export const PrivacyControls = ({ 
  settings, 
  onSettingsChange, 
  onDeleteSession,
  showInline = false 
}: PrivacyControlsProps) => {
  const handleToggle = (key: keyof PrivacySettings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const controls = (
    <div className="space-y-6">
      {/* Storage Control */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-clarify-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Database className="h-5 w-5 text-clarify-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="storage-toggle" className="text-sm font-medium text-foreground">
                Save Analysis Results
              </label>
              <p className="text-xs text-muted-foreground">
                Store your analysis for future reference (90-day auto-delete)
              </p>
            </div>
            <Switch
              id="storage-toggle"
              checked={settings.storageOptIn}
              onCheckedChange={() => handleToggle('storageOptIn')}
              aria-describedby="storage-help"
            />
          </div>
          <p id="storage-help" className="text-xs text-muted-foreground">
            {settings.storageOptIn 
              ? "✓ Your session will be saved securely" 
              : "Your session will be deleted when you close the app"
            }
          </p>
        </div>
      </div>

      {/* Name Redaction */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-clarify-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <UserX className="h-5 w-5 text-clarify-secondary" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="redact-toggle" className="text-sm font-medium text-foreground">
                Redact Personal Names
              </label>
              <p className="text-xs text-muted-foreground">
                Replace names with [Name] placeholders for privacy
              </p>
            </div>
            <Switch
              id="redact-toggle"
              checked={settings.redactNames}
              onCheckedChange={() => handleToggle('redactNames')}
              aria-describedby="redact-help"
            />
          </div>
          <p id="redact-help" className="text-xs text-muted-foreground">
            {settings.redactNames 
              ? "Names will be replaced with [Name] in analysis" 
              : "Names will appear as typed in your analysis"
            }
          </p>
        </div>
      </div>

      {/* Crisis Detection Notice */}
      <div className="p-4 bg-clarify-warning/10 border border-clarify-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-clarify-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground">Safety Notice</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Crisis detection is always active. If immediate danger is detected, 
              you'll be provided with emergency resources regardless of privacy settings.
            </p>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-foreground">Session Management</h4>
            <p className="text-xs text-muted-foreground">
              Delete current session and all associated data
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Current Session?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your current analysis session, including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All input and responses</li>
                    <li>Narrative loop analysis</li>
                    <li>SPIESS map data</li>
                    <li>Analysis summary</li>
                  </ul>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={onDeleteSession}>
                  Delete Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );

  if (showInline) {
    return (
      <Card className="shadow-soft border-muted/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Privacy & Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Control your data and privacy preferences</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {controls}
        </CardContent>
      </Card>
    );
  }

  return controls;
};