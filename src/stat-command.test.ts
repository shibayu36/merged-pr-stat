import { createStat, createPullRequestsByLog } from "./stat-command";
import path from "path";

describe("createStat", () => {
  it("can make stat by simple-log", () => {
    const prs = createPullRequestsByLog(path.resolve(__dirname, "testdata/simple-log.json"));
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additions": 1040,
        "additionsAverage": 260,
        "additionsMedian": 92.5,
        "authorCount": 3,
        "count": 4,
        "deletions": 283,
        "deletionsAverage": 70.75,
        "deletionsMedian": 23.5,
        "leadTimeSecondsAverage": 2911116,
        "leadTimeSecondsMedian": 658212,
        "timeToMergeFromFirstReviewSecondsAverage": 454493,
        "timeToMergeFromFirstReviewSecondsMedian": 454493,
        "timeToMergeSecondsAverage": 2591489,
        "timeToMergeSecondsMedian": 549684,
      }
    `);
  });

  it("can make stat by repo-vscode", () => {
    const prs = createPullRequestsByLog(path.resolve(__dirname, "testdata/log-repo-vscode.json"));
    const stat = createStat(prs);
    expect(stat).toMatchInlineSnapshot(`
      Object {
        "additions": 1514,
        "additionsAverage": 56.074074074074076,
        "additionsMedian": 8,
        "authorCount": 16,
        "count": 27,
        "deletions": 651,
        "deletionsAverage": 24.11111111111111,
        "deletionsMedian": 3,
        "leadTimeSecondsAverage": 633907,
        "leadTimeSecondsMedian": 164856,
        "timeToMergeFromFirstReviewSecondsAverage": 206823,
        "timeToMergeFromFirstReviewSecondsMedian": 17640,
        "timeToMergeSecondsAverage": 541799,
        "timeToMergeSecondsMedian": 32512,
      }
    `);
  });
});
