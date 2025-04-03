
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

// Type definitions for GitHub API responses
type ContentsResponse = Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response'];
export type FileData = Extract<ContentsResponse['data'], { type: 'file' }>;
type DirectoryData = Extract<ContentsResponse['data'], any[]>;

export class GitHubService {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({ auth: config.token });
    this.config = config;
  }

  // Fetch the content of a file at the given path
  async getFileContent(path: string): Promise<string> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (Array.isArray(response.data)) {
        throw new Error(`Path points to a directory, not a file: ${path}`);
      }

      const fileContent = response.data as FileData;
      if (!fileContent.content) {
        throw new Error(`File content is empty or not available for path: ${path}`);
      }

      return Buffer.from(fileContent.content, 'base64').toString();
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`File not found at path: ${path}`);
      }
      throw error;
    }
  }

  // Update a file's content at the given path
  async updateFile(path: string, content: string, message: string): Promise<void> {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (Array.isArray(response.data)) {
        throw new Error(`Path points to a directory, not a file: ${path}`);
      }

      const fileData = response.data as FileData;

      await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha: fileData.sha,
      });
    } catch (error) {
      if (error.status === 404) {
        throw new Error(`File not found at path: ${path}`);
      }
      throw error;
    }
  }

  // List files in a repository at the given path
  async listRepositoryFiles(path: string = ''): Promise<DirectoryData> {
    const response = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: this.config.owner,
      repo: this.config.repo,
      path,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!Array.isArray(response.data)) {
      throw new Error(`Expected directory listing, but got a single file at path: ${path}`);
    }

    return response.data as DirectoryData;
  }

  // Filter and return markdown files from the repository
  async getMarkdownFiles(): Promise<FileData[]> {
    const files = await this.listRepositoryFiles();
    return files.filter((file): file is FileData =>
      file.type === 'file' && file.name.toLowerCase().endsWith('.md')
    );
  }
}

// Helper function to get markdown files from a repository
export async function getMarkdownFiles(octokit: Octokit, owner: string, repo: string, path: string = ''): Promise<{name: string, content: string}[]> {
  try {
    // List all files in the repository at the given path
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!Array.isArray(response.data)) {
      throw new Error(`Path does not point to a directory: ${path}`);
    }

    const files = response.data as FileData[];
    
    // Filter for markdown files only
    const markdownFiles = files.filter(file => 
      file.type === 'file' && file.name.toLowerCase().endsWith('.md')
    );

    // Fetch the content of each markdown file
    const markdownContents = await Promise.all(
      markdownFiles.map(async (file) => {
        const contentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: file.path,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (Array.isArray(contentResponse.data)) {
          throw new Error(`Expected file but got directory: ${file.path}`);
        }

        const fileData = contentResponse.data as FileData;
        const content = Buffer.from(fileData.content, 'base64').toString();

        return {
          name: file.name,
          content
        };
      })
    );

    return markdownContents;
  } catch (error) {
    console.error("Error fetching markdown files:", error);
    throw error;
  }
}
