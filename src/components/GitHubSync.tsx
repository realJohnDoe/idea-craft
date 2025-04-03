
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Item,
  parseYaml,
  parseYamlToItem,
} from "@/lib/content-utils";
import { generateUniqueId, createSafeFilename } from "@/lib/id-utils";
import { authenticateWithGitHub } from "@/lib/github-auth";

interface GitHubSyncProps {
  items: Item[];
  onUpdate: (updatedItem: Item) => void;
  allItems: Item[];
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ items, onUpdate, allItems }) => {
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoPath, setRepoPath] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncWithGitHub = async () => {
    if (!repoOwner || !repoName || !repoPath) {
      toast.error("Please provide repository details.");
      return;
    }

    setIsSyncing(true);

    try {
      const octokit = await authenticateWithGitHub();
      if (!octokit) {
        toast.error("Failed to authenticate with GitHub.");
        return;
      }

      // This would be replaced by actual getMarkdownFiles implementation
      const files = []; // await getMarkdownFiles(octokit, repoOwner, repoName, repoPath);

      if (!files || files.length === 0) {
        toast.error("No Markdown files found in the repository.");
        return;
      }

      for (const file of files) {
        try {
          const { yamlData, content: markdownContent } = parseYaml(file.content);

          // Check if an item with the same title already exists
          const existingItem = items.find((item) => item.title === file.name.replace(".md", ""));

          if (existingItem) {
            // Update the existing item
            const updatedItem: Item = {
              ...existingItem,
              content: markdownContent,
              updatedAt: new Date(),
            };

            // Parse YAML data and apply it to the item
            const parsedItem = parseYamlToItem(yamlData, updatedItem);
            onUpdate(parsedItem);
          } else {
            // Create a new item
            const newItem: Item = {
              id: generateUniqueId(),
              title: file.name.replace(".md", ""),
              content: markdownContent,
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: [],
            };

            // Parse YAML data and apply it to the item
            const parsedItem = parseYamlToItem(yamlData, newItem);
            onUpdate(parsedItem);
          }
        } catch (error: any) {
          console.error(`Error processing file ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}: ${error.message}`);
        }
      }

      toast.success("Successfully synced with GitHub!");
    } catch (error: any) {
      console.error("GitHub sync error:", error);
      toast.error(`GitHub sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Sync with GitHub</h2>
      <p className="text-sm text-muted-foreground">
        Enter the repository details to sync your content.
      </p>
      <div>
        <Label htmlFor="repo-owner">Repository Owner</Label>
        <Input
          type="text"
          id="repo-owner"
          value={repoOwner}
          onChange={(e) => setRepoOwner(e.target.value)}
          placeholder="e.g., your-username"
        />
      </div>
      <div>
        <Label htmlFor="repo-name">Repository Name</Label>
        <Input
          type="text"
          id="repo-name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          placeholder="e.g., your-repo"
        />
      </div>
      <div>
        <Label htmlFor="repo-path">Repository Path</Label>
        <Input
          type="text"
          id="repo-path"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          placeholder="e.g., /docs"
        />
      </div>
      <Button onClick={handleSyncWithGitHub} disabled={isSyncing}>
        {isSyncing ? "Syncing..." : "Sync with GitHub"}
      </Button>
    </div>
  );
};

export default GitHubSync;
