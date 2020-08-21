import { fetchAllMergedPullRequests } from "./github";
import csvStringify from "csv-stringify/lib/sync";

interface LogCommandOptions {
  start: string;
  end: string;
  query: string;
  format: string;
}
export async function logCommand(options: LogCommandOptions): Promise<void> {
  const prs = await fetchAllMergedPullRequests(options.query, options.start, options.end);

  if (options.format === "json") {
    process.stdout.write(JSON.stringify(prs, undefined, 2));
  } else if (options.format === "csv") {
    process.stdout.write(csvStringify(prs, { header: true }));
  } else {
    console.error("--format can be csv or json only");
    process.exit(1);
  }
}
