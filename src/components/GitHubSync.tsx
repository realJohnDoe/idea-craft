import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Item,
  parseYamlToItem,
  parseYaml,
  generateUniqueId,
  itemToContent,
  formatContentWithYaml,
} from "@/lib/content-utils";
import { GitHubService, FileData } from "@/lib/github";
import { getInstallationAccessToken } from "@/lib/github-auth";
import { generateRandomHash } from "@/lib/utils";

interface GitHubSyncProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ items, setItems }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [repository, setRepository] = useState("");
  const [syncedFiles, setSyncedFiles] = useState<string[]>([]);
  const [githubService, setGithubService] = useState<GitHubService | null>(
    null
  );
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [state, setState] = useState<string | null>(null);

  const handleConnectToGitHub = () => {
    // Generate a random string for the state parameter
    const newState = generateRandomHash(16);
    setState(newState);

    // Construct the authorization URL
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${window.location.origin}/github-callback&state=${newState}`;

    // Redirect the user to GitHub
    window.location.href = authUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const returnedState = urlParams.get("state");

    if (code && returnedState) {
      // Verify the state parameter
      if (returnedState !== state) {
        toast.error("Invalid state parameter");
        return;
      }

      // Remove code and state from URL without page refresh
      window.history.replaceState({}, document.title, window.location.pathname);

      // Exchange the code for an access token and get the installation access token
      getInstallationAccessToken(code)
        .then((accessToken) => {
          if (repository) {
            setGithubService(
              new GitHubService({
                token: accessToken,
                owner: repository.split("/")[0],
                repo: repository.split("/")[1],
              })
            );
          }
          toast.success("Successfully authenticated with GitHub");
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
          toast.error("Error authenticating with GitHub");
        });
    }
  }, [repository, state]);

  const handleSync = async () => {
    if (!repository) {
      toast.error("Please enter a repository name");
      return;
    }
    if (!githubService) {
      toast.error("Not connected to github");
      return;
    }

    setIsSyncing(true);
    toast.info(`Syncing ${items.length} items to ${repository}...`);

    try {
      // Generate files and update them in the repository
      const fileNames = await Promise.all(
        items.map(async (item) => {
          const fileName = item.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          const content = formatContentWithYaml(itemToContent(item));
          await githubService.updateFile(
            `${fileName}.md`,
            content,
            `Update ${fileName}.md`
          );
          return `${fileName}.md`;
        })
      );

      setSyncedFiles(fileNames);
      toast.success(
        `Successfully synced ${items.length} items to ${repository}`
      );
    } catch (error) {
      console.error("Error syncing files:", error);
      toast.error("Error syncing files to GitHub");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFetchFiles = async () => {
    if (!githubService) {
      toast.error("Not connected to GitHub");
      return;
    }
    setIsLoadingFiles(true);
    try {
      const markdownFiles: FileData[] = await githubService.getMarkdownFiles();
      const fetchedItems: Item[] = [];
      const existingIds = new Set(items.map((item) => item.id));

      for (const file of markdownFiles) {
        const contentString = await githubService.getFileContent(file.path);
        const { yamlData, content: textContent } = parseYaml(contentString);

        const baseTitle = file.name.replace(/\.(md|txt)$/, "");
        const baseId = baseTitle.toLowerCase().replace(/\s+/g, "-");

        const mainContent: Item = {
          id: generateUniqueId(baseId, existingIds),
          title: baseTitle,
          content: textContent,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        };

        const parsedMainContent = parseYamlToItem(yamlData, mainContent);
        fetchedItems.push(parsedMainContent);
      }
      setItems(fetchedItems);
      toast.success(
        `Successfully fetched ${fetchedItems.length} items from GitHub`
      );
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Error fetching files from GitHub");
    } finally {
      setIsLoadingFiles(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-background">
      <h3 className="flex items-center mb-4 text-lg font-medium">
        <Github className="mr-2 size-5" />
        GitHub Sync
      </h3>

      {githubService ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
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
              <p className="mt-1 text-xs text-muted-foreground">
                Format: username/repository (e.g., yourname/content-repo)
              </p>
            </div>

            {syncedFiles.length > 0 && (
              <div className="p-2 mt-4 rounded-md border bg-muted/40">
                {/* ... (rest of the synced files UI) */}
              </div>
            )}

            <div className="flex justify-end">
              <div className="flex gap-2">
                <Button
                  onClick={handleFetchFiles}
                  disabled={isLoadingFiles || !repository}
                >
                  {isLoadingFiles && (
                    <Loader2 className="mr-2 animate-spin size-4" />
                  )}
                  {isLoadingFiles ? "Loading..." : "Fetch Content"}
                </Button>
                <Button
                  onClick={handleSync}
                  disabled={isSyncing || !repository}
                >
                  {isSyncing && (
                    <Loader2 className="mr-2 animate-spin size-4" />
                  )}
                  {isSyncing ? "Syncing..." : "Sync Content"}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to sync your content.
          </p>
          <Button onClick={handleConnectToGitHub}>Connect to GitHub</Button>
        </div>
      )}
    </div>
  );
};

export default GitHubSync;
