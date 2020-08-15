import fs from "fs";
import { PullRequest } from "./types";
import { uniq } from "underscore";
import { median } from "mathjs";
import { fetchAllMergedPullRequests } from "./github";
import { parseISO } from "date-fns";

interface StatCommandOptions {
  input: string | undefined;
  start: string | undefined;
  end: string | undefined;
  query: string | undefined;
}
export async function statCommand(options: StatCommandOptions): Promise<void> {
  let prs: PullRequest[] = [];

  if (options.query) {
    prs = await fetchAllMergedPullRequests(options.query, options.start, options.end);
  } else if (options.input) {
    prs = JSON.parse(fs.readFileSync(options.input, "utf8"));
  } else {
    console.error("You must specify either --query or --input");
    process.exit(1);
  }

  process.stdout.write(JSON.stringify(createStat(prs), undefined, 2));
}

interface PullRequestStat {
  count: number;
  authorCount: number;
  additionsAverage: number;
  additionsMedian: number;
  deletionsAverage: number;
  deletionsMedian: number;
  leadTimeAverage: number;
  leadTimeMedian: number;
}
export function createStat(prs: PullRequest[]): PullRequestStat {
  const leadTimes = prs.map((pr) => (parseISO(pr.mergedAt).getTime() - parseISO(pr.createdAt).getTime()) / 1000);

  return {
    count: prs.length,
    authorCount: uniq(prs.map((pr) => pr.author.login)).length,
    additionsAverage: average(prs.map((pr) => pr.additions)),
    additionsMedian: median(prs.map((pr) => pr.additions)),
    deletionsAverage: average(prs.map((pr) => pr.deletions)),
    deletionsMedian: median(prs.map((pr) => pr.deletions)),
    leadTimeAverage: Math.floor(average(leadTimes)),
    leadTimeMedian: Math.floor(median(leadTimes)),
  };
}

function average(numbers: number[]): number {
  return numbers.reduce((prev, current) => prev + current) / numbers.length;
}
