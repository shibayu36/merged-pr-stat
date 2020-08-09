import fs from "fs";
import { PullRequest } from "./types";
import { uniq } from "underscore";
import { median } from "mathjs";

interface StatCommandOptions {
  input: string;
}
export async function statCommand(options: StatCommandOptions): Promise<void> {
  const prs: PullRequest[] = JSON.parse(fs.readFileSync(options.input, "utf8"));
}

interface PullRequestStat {
  count: number;
  authorCount: number;
  additionsAverage: number;
  additionsMedian: number;
  deletionsAverage: number;
  deletionsMedian: number;
}
export function createStat(prs: PullRequest[]): PullRequestStat {
  return {
    count: prs.length,
    authorCount: uniq(prs.map((pr) => pr.author.login)).length,
    additionsAverage: average(prs.map((pr) => pr.additions)),
    additionsMedian: median(prs.map((pr) => pr.additions)),
    deletionsAverage: average(prs.map((pr) => pr.deletions)),
    deletionsMedian: median(prs.map((pr) => pr.deletions)),
  };
}

function average(numbers: number[]): number {
  return numbers.reduce((prev, current) => prev + current) / numbers.length;
}
