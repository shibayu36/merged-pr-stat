import fs from "fs";
import path from "path";
import { PullRequest } from "./entity";
import { uniq } from "underscore";
import { median as _median } from "mathjs";
import { fetchAllMergedPullRequests } from "./github";

interface StatCommandOptions {
  input: string | undefined;
  start: string | undefined;
  end: string | undefined;
  query: string | undefined;
  outputFile: string | undefined;
}
export async function statCommand(options: StatCommandOptions): Promise<void> {
  let prs: PullRequest[] = [];

  if (options.query) {
    prs = await fetchAllMergedPullRequests(options.query, options.start, options.end);
  } else if (options.input) {
    prs = createPullRequestsByLog(options.input);
  } else {
    console.error("You must specify either --query or --input");
    process.exit(1);
  }

  const output = JSON.stringify(createStat(prs), undefined, 2);

  if (options.outputFile) {
    const filePath = path.resolve(process.cwd(), options.outputFile);
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, output);
    } catch (error) {
      console.error("There was a problem writing the output file:\n%s", error);
      process.exit(1);
    }
  } else {
    process.stdout.write(output);
  }
}

interface PullRequestStat {
  count: number;
  authorCount: number;
  additionsAverage: number;
  additionsMedian: number;
  deletionsAverage: number;
  deletionsMedian: number;
  leadTimeSecondsAverage: number;
  leadTimeSecondsMedian: number;
  timeToMergeSecondsAverage: number;
  timeToMergeSecondsMedian: number;
  timeToMergeFromFirstReviewSecondsAverage: number;
  timeToMergeFromFirstReviewSecondsMedian: number;
}
export function createStat(prs: PullRequest[]): PullRequestStat {
  const leadTimes = prs.map((pr) => pr.leadTimeSeconds);
  const timeToMerges = prs.map((pr) => pr.timeToMergeSeconds);
  const timeToMergeFromFirstReviews = prs
    .map((pr) => pr.timeToMergeFromFirstReviewSeconds)
    .filter((x): x is number => x !== undefined);

  return {
    count: prs.length,
    authorCount: uniq(prs.map((pr) => pr.author)).length,
    additionsAverage: average(prs.map((pr) => pr.additions)),
    additionsMedian: median(prs.map((pr) => pr.additions)),
    deletionsAverage: average(prs.map((pr) => pr.deletions)),
    deletionsMedian: median(prs.map((pr) => pr.deletions)),
    leadTimeSecondsAverage: Math.floor(average(leadTimes)),
    leadTimeSecondsMedian: Math.floor(median(leadTimes)),
    timeToMergeSecondsAverage: Math.floor(average(timeToMerges)),
    timeToMergeSecondsMedian: Math.floor(median(timeToMerges)),
    timeToMergeFromFirstReviewSecondsAverage: Math.floor(average(timeToMergeFromFirstReviews)),
    timeToMergeFromFirstReviewSecondsMedian: Math.floor(median(timeToMergeFromFirstReviews)),
  };
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((prev, current) => prev + current) / numbers.length;
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return _median(numbers);
}

export function createPullRequestsByLog(path: string): PullRequest[] {
  const logs = JSON.parse(fs.readFileSync(path, "utf8"));
  return logs.map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) =>
      new PullRequest(
        p.title,
        p.author,
        p.url,
        p.createdAt,
        p.mergedAt,
        p.additions,
        p.deletions,
        p.authoredDate,
        p.firstReviewedAt
      )
  );
}
