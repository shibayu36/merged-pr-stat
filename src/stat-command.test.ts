import fs from "fs";
import { PullRequest } from "./types";
import { createStat } from "./stat-command";
import path from "path";

describe("createStat", () => {
  it("can make stat by simple-log", () => {
    const prs: PullRequest[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, "testdata/simple-log.json"), "utf8"));
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additionsAverage": 260,
        "additionsMedian": 92.5,
        "authorCount": 3,
        "count": 4,
        "deletionsAverage": 70.75,
        "deletionsMedian": 23.5,
        "leadTimeAverage": 2591489,
        "leadTimeMedian": 549684,
      }
    `);
  });

  it("can make stat by repo-vscode", () => {
    const prs: PullRequest[] = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "testdata/log-repo-vscode.json"), "utf8")
    );
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additionsAverage": 56.074074074074076,
        "additionsMedian": 8,
        "authorCount": 16,
        "count": 27,
        "deletionsAverage": 24.11111111111111,
        "deletionsMedian": 3,
        "leadTimeAverage": 541799,
        "leadTimeMedian": 32512,
      }
    `);
  });
});
