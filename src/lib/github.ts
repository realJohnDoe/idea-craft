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

// Function to get markdown files from a GitHub repository
export async function getMarkdownFiles(octokit: Octokit, owner: string, repo: string, path: string = '') {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!Array.isArray(response.data)) {
      throw new Error(`Path points to a file, not a directory: ${path}`);
    }

    const files = response.data.filter((file: any) => 
      file.type === 'file' && file.name.toLowerCase().endsWith('.md')
    );

    // For each file, get its content
    const filesWithContent = await Promise.all(
      files.map(async (file: any) => {
        const contentResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner,
          repo,
          path: file.path,
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
          },
        });

        return {
          ...file,
          content: typeof contentResponse.data === 'string' 
            ? contentResponse.data 
            : Buffer.from(contentResponse.data.content, 'base64').toString('utf-8')
        };
      })
    );

    return filesWithContent;
  } catch (error) {
    console.error("Error fetching Markdown files:", error);
    throw error;
  }
}
