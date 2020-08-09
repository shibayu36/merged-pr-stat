export interface PullRequest {
  title: string;
  author: {
    login: string;
  };
  url: string;
  createdAt: string;
  mergedAt: string;
  additions: number;
  deletions: number;
}
