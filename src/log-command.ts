import { fetchAllMergedPullRequests } from "./github";

interface LogCommandOptions {
  start: string;
  end: string;
  query: string;
}
export async function logCommand(options: LogCommandOptions): Promise<void> {
  const prs = await fetchAllMergedPullRequests(options.query, options.start, options.end);
  process.stdout.write(JSON.stringify(prs, undefined, 2));
}
