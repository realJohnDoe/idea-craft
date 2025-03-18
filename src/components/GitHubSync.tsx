
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Loader2, ExternalLink, CheckCircle2, File, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Content, formatContentWithYaml } from '@/lib/content-utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface GitHubSyncProps {
  items: Content[];
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ items }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'initial' | 'creating-app' | 'authorizing'>('initial');
  const [isSyncing, setIsSyncing] = useState(false);
  const [repository, setRepository] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [syncedFiles, setSyncedFiles] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const callbackUrl = window.location.origin + '/github-callback';

  // Simulation: Check if we have a code in the URL (would happen after OAuth redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && clientId) {
      // This would actually exchange the code for an access token
      setTimeout(() => {
        setIsAuthenticated(true);
        // Remove code from URL without page refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        toast.success('Successfully authenticated with GitHub');
      }, 1000);
    }
  }, [clientId]);

  const handleAuth = () => {
    if (!clientId) {
      toast.error('Please enter a GitHub Client ID');
      return;
    }
    
    // In a real app, we'd redirect to GitHub OAuth
    setAuthStep('authorizing');
    toast.info('Connecting to GitHub...');
    
    // Simulate OAuth flow
    setTimeout(() => {
      setIsAuthenticated(true);
      setAuthStep('initial');
      toast.success('Connected to GitHub');
    }, 1500);
  };

  const handleSync = () => {
    if (!repository) {
      toast.error('Please enter a repository name');
      return;
    }
    
    setIsSyncing(true);
    toast.info(`Syncing ${items.length} items to ${repository}...`);
    
    // Simulate generating files
    const fileNames = items.map(item => {
      // Convert title to kebab-case for filenames
      const fileName = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return `${fileName}.md`;
    });
    
    // Simulate syncing
    setTimeout(() => {
      setSyncedFiles(fileNames);
      setIsSyncing(false);
      toast.success(`Successfully synced ${items.length} items to ${repository}`);
    }, 2000);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (authStep === 'creating-app') {
    return (
      <div className="border rounded-lg p-4 bg-background">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Github className="mr-2 size-5" />
          Create a GitHub OAuth App
        </h3>
        
        <ol className="list-decimal ml-5 space-y-4 mb-4">
          <li className="text-sm">
            Go to <a href="https://github.com/settings/developers" target="_blank" className="underline text-primary flex items-center">
              GitHub Developer Settings <ExternalLink className="size-3 ml-1" />
            </a>
          </li>
          <li className="text-sm">Click "New OAuth App"</li>
          <li className="text-sm">
            Fill in the application details:
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li>Application name: "IdeaCraft Sync" (or any name you prefer)</li>
              <li>Homepage URL: <code className="bg-muted px-1 py-0.5 rounded">{window.location.origin}</code></li>
              <li>
                Authorization callback URL: 
                <div className="flex items-center mt-1 bg-muted p-1 rounded">
                  <code className="flex-1 px-1">{callbackUrl}</code>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="size-6" 
                    onClick={() => handleCopyToClipboard(callbackUrl)}
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              </li>
            </ul>
          </li>
          <li className="text-sm">
            After creating the app, you'll receive a Client ID and Client Secret
          </li>
        </ol>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setAuthStep('initial')}
          >
            Back
          </Button>
          <Button 
            variant="default"
            onClick={() => setAuthStep('initial')}
          >
            I've created my app
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="border rounded-lg p-4 bg-background">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Github className="mr-2 size-5" />
          Connect to GitHub
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Sync your content to a GitHub repository as markdown files with YAML frontmatter.
        </p>
        
        <div className="space-y-3">
          <div>
            <label htmlFor="client-id" className="text-sm font-medium">
              GitHub Client ID
            </label>
            <Input
              id="client-id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter your GitHub Client ID"
              className="mt-1"
            />
          </div>
          
          {showSettings && (
            <div>
              <label htmlFor="client-secret" className="text-sm font-medium">
                GitHub Client Secret
              </label>
              <Input
                id="client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your GitHub Client Secret"
                className="mt-1"
              />
            </div>
          )}
          
          <Alert className="bg-muted/50 border-muted">
            <AlertDescription className="text-xs text-muted-foreground">
              You need to create a GitHub OAuth App to get your Client ID. The Authorization callback URL should be:
              <div className="flex items-center mt-1 bg-background p-1 rounded">
                <code className="flex-1 text-xs px-1">{callbackUrl}</code>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="size-6" 
                  onClick={() => handleCopyToClipboard(callbackUrl)}
                >
                  <Copy className="size-3" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="link"
                className="text-xs"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? 'Hide advanced settings' : 'Show advanced settings'}
              </Button>
              
              <Button 
                variant="link" 
                className="text-xs"
                onClick={() => setAuthStep('creating-app')}
              >
                How to create an app?
              </Button>
            </div>
            
            <Button
              onClick={handleAuth}
              className="bg-[#24292e] hover:bg-[#1b1f23]"
            >
              <Github className="mr-2 size-4" />
              Connect
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-background">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Github className="mr-2 size-5" />
        GitHub Sync
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        Your account is connected. Sync your content to a GitHub repository.
      </p>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="repository" className="text-sm font-medium">
            Repository Name
          </label>
          <Input
            id="repository"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
            placeholder="username/repository"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Format: username/repository (e.g., yourname/content-repo)
          </p>
        </div>
        
        {syncedFiles.length > 0 && (
          <div className="mt-4 border rounded-md p-2 bg-muted/40">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CheckCircle2 className="text-green-500 mr-1 size-4" />
              Successfully synced files:
            </h4>
            <div className={`${isMobile ? 'max-h-40' : 'max-h-60'} overflow-y-auto p-1`}>
              {syncedFiles.map((file, index) => (
                <div key={index} className="text-xs py-1 px-2 rounded flex items-center">
                  <File className="mr-1 size-3 text-muted-foreground" />
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setSyncedFiles([]);
            }}
          >
            Disconnect
          </Button>
          
          <Button
            onClick={handleSync}
            disabled={isSyncing || !repository}
          >
            {isSyncing && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSyncing ? 'Syncing...' : 'Sync Content'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GitHubSync;
