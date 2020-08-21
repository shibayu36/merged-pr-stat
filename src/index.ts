import { program } from "commander";
import { logCommand } from "./log-command";
import { statCommand } from "./stat-command";

async function main(): Promise<void> {
  program.version("0.1.0");

  program
    .command("stat", { isDefault: true })
    .option("--input <filepath>")
    .option("--start <date>")
    .option("--end <date>")
    .option("--query <search query>")
    .action(statCommand);

  program
    .command("log")
    .requiredOption("--start <date>", "start date")
    .requiredOption("--end <date>", "end date")
    .requiredOption("--query <search query>", "query for github search")
    .option("--format <format>", "output format.  The available is json or csv", "json")
    .action(logCommand);

  program.parse(process.argv);
}

main().catch((error) => console.error(error));
