import { program } from "commander";
import { parseISO, add, addDays, format, min } from "date-fns";
import { execFileSync } from "child_process";
import csvStringify from "csv-stringify/lib/sync";

async function main(): Promise<void> {
  program.requiredOption("--start <date>").requiredOption("--end <date>").requiredOption("--query <query>");

  program.parse(process.argv);

  const startDate = parseISO(program.start);
  const endDate = parseISO(program.end);
  const query = program.query as string;

  const intervalDays = 7;
  const allLogs = [];
  process.stdout.write(
    "title,author,url,createdAt,mergedAt,additions,deletions,authoredDate,leadTimeSeconds,timeToMergeSeconds\n"
  );
  for (let start = startDate; start < endDate; start = addDays(start, intervalDays)) {
    const end = min([add(start, { days: intervalDays, seconds: -1 }), endDate]);
    console.error(format(start, "yyyy-MM-dd HH:mm:ss"));
    console.error(format(end, "yyyy-MM-dd HH:mm:ss"));

    const stdout = execFileSync(
      "merged-pr-stat",
      ["log", "--start", start.toISOString(), "--end", end.toISOString(), "--query", query],
      { encoding: "utf8" }
    );
    const logs: any[] = JSON.parse(stdout);
    process.stdout.write(
      csvStringify(
        logs.map((l) => [
          l.title,
          l.author,
          l.url,
          l.createdAt,
          l.mergedAt,
          l.additions,
          l.deletions,
          l.authoredDate,
          l.leadTimeSeconds,
          l.timeToMergeSeconds,
        ])
      )
    );
  }
}

main().catch((error) => console.error(error));
