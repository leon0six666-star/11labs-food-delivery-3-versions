import { useState } from 'react';
import { Settings, X, Check, Info, AlertTriangle, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useElevenLabsConfig, validateAgentId, validateApiKey, ValidationResult } from '@/hooks/use-elevenlabs-config';
import { useToast } from '@/hooks/use-toast';

export const ElevenLabsSettings = () => {
  const { config, updateConfig, clearConfig, hasAgentId } = useElevenLabsConfig();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [agentId, setAgentId] = useState(config.agentId);
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [agentIdValidation, setAgentIdValidation] = useState<ValidationResult | null>(null);
  const [apiKeyValidation, setApiKeyValidation] = useState<ValidationResult | null>(null);

  // Validate Agent ID on change
  const handleAgentIdChange = (value: string) => {
    setAgentId(value);
    if (value.trim()) {
      const validation = validateAgentId(value);
      setAgentIdValidation(validation);
    } else {
      setAgentIdValidation(null);
    }
  };

  // Validate API Key on change
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value.trim()) {
      const validation = validateApiKey(value);
      setApiKeyValidation(validation);
    } else {
      setApiKeyValidation(null);
    }
  };

  const handleSave = () => {
    // Final validation before save
    const agentValidation = validateAgentId(agentId);
    const keyValidation = validateApiKey(apiKey);
    
    setAgentIdValidation(agentValidation);
    setApiKeyValidation(keyValidation);

    // Check for errors
    if (!agentValidation.isValid) {
      toast({
        title: "Invalid Agent ID",
        description: agentValidation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    if (!keyValidation.isValid) {
      toast({
        title: "Invalid API Key",
        description: keyValidation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Show warnings if any
    const allWarnings = [...agentValidation.warnings, ...keyValidation.warnings];
    if (allWarnings.length > 0) {
      toast({
        title: "Configuration Warnings",
        description: allWarnings.join(', '),
      });
    }

    updateConfig({ agentId: agentId.trim(), apiKey: apiKey.trim() || undefined });
    
    toast({
      title: "Settings Saved",
      description: "Your ElevenLabs configuration has been saved. Refresh the page to see the voice widget.",
    });

    // Close the dialog after a brief delay
    setTimeout(() => {
      setOpen(false);
      // Reload to apply the widget with new agent ID
      window.location.reload();
    }, 1500);
  };

  const handleClear = () => {
    clearConfig();
    setAgentId('');
    setApiKey('');
    
    toast({
      title: "Settings Cleared",
      description: "ElevenLabs configuration has been removed. Refresh to remove the voice widget.",
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleExportConfig = () => {
    const exportData = {
      agentId: config.agentId,
      apiKey: config.apiKey,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevenlabs-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Your settings have been downloaded as a JSON file.",
    });
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        
        // Validate imported data
        if (!imported.agentId) {
          toast({
            title: "Invalid Configuration File",
            description: "The file doesn't contain a valid Agent ID.",
            variant: "destructive"
          });
          return;
        }

        // Validate the imported Agent ID
        const validation = validateAgentId(imported.agentId);
        if (!validation.isValid) {
          toast({
            title: "Invalid Agent ID in File",
            description: validation.errors.join(', '),
            variant: "destructive"
          });
          return;
        }

        // Import the configuration
        setAgentId(imported.agentId);
        setApiKey(imported.apiKey || '');
        
        toast({
          title: "Configuration Imported",
          description: "Settings have been loaded from file. Click 'Save & Reload' to apply.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse configuration file. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be imported again
    event.target.value = '';
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset form to current config when opening
      setAgentId(config.agentId);
      setApiKey(config.apiKey || '');
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-white hover:bg-gray-50 z-40"
          title="ElevenLabs Settings"
        >
          <Settings className="h-6 w-6" />
          {hasAgentId && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ElevenLabs Voice AI Configuration</DialogTitle>
          <DialogDescription>
            Configure your ElevenLabs agent to enable voice-powered food ordering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Get your Agent ID from <a 
                href="https://elevenlabs.io/app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                ElevenLabs Dashboard
              </a> after creating your conversational AI agent.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentId" className="text-sm font-medium">
                Agent ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="agentId"
                placeholder="e.g., gfxc5G8NfuhDmMvpv8tZ"
                value={agentId}
                onChange={(e) => handleAgentIdChange(e.target.value)}
                className={`font-mono text-sm ${
                  agentIdValidation 
                    ? agentIdValidation.isValid 
                      ? 'border-green-500' 
                      : 'border-red-500' 
                    : ''
                }`}
              />
              {agentIdValidation && !agentIdValidation.isValid && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {agentIdValidation.errors.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
              {agentIdValidation && agentIdValidation.isValid && agentIdValidation.warnings.length > 0 && (
                <Alert className="py-2 border-yellow-500 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-xs text-yellow-600">
                    {agentIdValidation.warnings.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
              <p className="text-xs text-muted-foreground">
                Your unique ElevenLabs agent identifier (typically 20 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                API Key <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="xi_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Reserved for future advanced features
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSave} 
              className="flex-1"
              disabled={!agentId.trim()}
            >
              <Check className="mr-2 h-4 w-4" />
              Save & Reload
            </Button>
            {hasAgentId && (
              <Button 
                onClick={handleClear} 
                variant="destructive"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Config
              </Button>
            )}
          </div>

          {hasAgentId && (
            <>
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Voice AI Active</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Agent ID: {config.agentId}
                </p>
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Backup & Restore</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportConfig}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Config
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <label>
                      <Upload className="mr-2 h-4 w-4" />
                      Import Config
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Backup your settings or restore from a previous export
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
