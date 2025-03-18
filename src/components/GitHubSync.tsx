
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Content, formatContentWithYaml } from '@/lib/content-utils';

interface GitHubSyncProps {
  items: Content[];
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ items }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [repository, setRepository] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleAuth = () => {
    if (!clientId) {
      toast.error('Please enter a GitHub Client ID');
      return;
    }
    
    // This would be replaced with actual GitHub OAuth flow
    // For now, we'll simulate authentication
    toast.info('Connecting to GitHub...');
    
    setTimeout(() => {
      setIsAuthenticated(true);
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
    
    // Simulate syncing items to GitHub
    setTimeout(() => {
      setIsSyncing(false);
      toast.success(`Successfully synced ${items.length} items to ${repository}`);
    }, 2000);
  };

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
          
          <div className="flex items-center justify-between">
            <Button
              variant="link"
              className="text-xs"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide advanced settings' : 'Show advanced settings'}
            </Button>
            
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
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
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
