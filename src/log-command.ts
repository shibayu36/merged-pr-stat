import { parseISO } from "date-fns";
import { gql } from "graphql-request";
import { graphQLClient } from "./github";

interface LogCommandOptions {
  start: string;
  end: string;
  query: string;
}
export async function logCommand(options: LogCommandOptions): Promise<void> {
  const startDate = parseISO(options.start);
  const endDate = parseISO(options.end);
  const query = options.query;

  const searchQuery = `is:pr is:merged merged:${startDate.toISOString()}..${endDate.toISOString()} ${query}`;
  const prs = await fetchAllPullRequestsByQuery(searchQuery);
  process.stdout.write(JSON.stringify(prs, undefined, 2));
}

interface PullRequest {
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
async function fetchAllPullRequestsByQuery(searchQuery: string): Promise<PullRequest[]> {
  const query = gql`
    query($after: String) {
      search(type: ISSUE, first: 100, query: "${searchQuery}", after: $after) {
        issueCount
        nodes {
          ... on PullRequest {
            title
            author {
              login
            }
            url
            createdAt
            mergedAt
            additions
            deletions
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      rateLimit {
        limit
        cost
        remaining
        resetAt
      }
    }
  `;

  let after: string | undefined;
  let prs: PullRequest[] = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await graphQLClient.request(query, { after });
    prs = prs.concat(data.search.nodes as PullRequest[]);

    if (!data.search.pageInfo.hasNextPage) break;

    console.debug(JSON.stringify(data, undefined, 2));

    after = data.search.pageInfo.endCursor;
  }

  return prs;
}
