
import { toast } from "sonner";
import { Octokit } from "octokit";

/**
 * Authenticate with GitHub using the GitHub OAuth flow
 * @returns A Promise that resolves to the authenticated Octokit instance
 */
export async function authenticateWithGitHub(): Promise<Octokit | null> {
  try {
    // For demo purposes, we're using a simplified approach
    // In a real app, this would use proper OAuth flow
    const token = localStorage.getItem('github_token');
    
    if (!token) {
      // For this demo, we'll prompt for a token
      const userToken = prompt("Please enter your GitHub personal access token:");
      if (!userToken) {
        toast.error("No token provided");
        return null;
      }
      
      localStorage.setItem('github_token', userToken);
      return new Octokit({ auth: userToken });
    }
    
    return new Octokit({ auth: token });
  } catch (error) {
    console.error("GitHub authentication error:", error);
    toast.error("Failed to authenticate with GitHub");
    return null;
  }
}

/**
 * Get an authenticated Octokit instance
 * @returns The Octokit instance or null if not authenticated
 */
export function getOctokit(): Octokit | null {
  const token = localStorage.getItem('github_token');
  if (!token) return null;
  return new Octokit({ auth: token });
}
