import { fetchAllMergedPullRequests } from "./github";
import csvStringify from "csv-stringify/lib/sync";

interface LogCommandOptions {
  start: string;
  end: string;
  query: string;
  format: string;
  quoted: string;
}
export async function logCommand(options: LogCommandOptions): Promise<void> {
  const prs = await fetchAllMergedPullRequests(options.query, options.start, options.end);
  const quoted = options.quoted ? true : false;

  if (options.format === "json") {
    process.stdout.write(JSON.stringify(prs, undefined, 2));
  } else if (options.format === "csv") {
    process.stdout.write(csvStringify(prs, { header: true, quoted: quoted}));
  } else if (options.format === "tsv") {
    process.stdout.write(csvStringify(prs, { header: true, quoted: quoted, delimiter: '\t' }));
  } else {
    console.error("--format can be csv or json only");
    process.exit(1);
  }
}
