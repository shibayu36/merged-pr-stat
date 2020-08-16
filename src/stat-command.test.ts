import { createStat, createPullRequestsByLog } from "./stat-command";
import path from "path";

describe("createStat", () => {
  it("can make stat by simple-log", () => {
    const prs = createPullRequestsByLog(path.resolve(__dirname, "testdata/simple-log.json"));
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additionsAverage": 260,
        "additionsMedian": 92.5,
        "authorCount": 3,
        "count": 4,
        "deletionsAverage": 70.75,
        "deletionsMedian": 23.5,
        "leadTimeSecondsAverage": 2591489,
        "leadTimeSecondsMedian": 549684,
        "timeToMergeSecondsAverage": 2911116,
        "timeToMergeSecondsMedian": 658212,
      }
    `);
  });

  it("can make stat by repo-vscode", () => {
    const prs = createPullRequestsByLog(path.resolve(__dirname, "testdata/log-repo-vscode.json"));
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additionsAverage": 56.074074074074076,
        "additionsMedian": 8,
        "authorCount": 16,
        "count": 27,
        "deletionsAverage": 24.11111111111111,
        "deletionsMedian": 3,
        "leadTimeSecondsAverage": 541799,
        "leadTimeSecondsMedian": 32512,
        "timeToMergeSecondsAverage": 633907,
        "timeToMergeSecondsMedian": 164856,
      }
    `);
  });
});
