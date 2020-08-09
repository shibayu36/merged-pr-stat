import { program } from "commander";
import { logCommand } from "./log-command";
import { statCommand } from "./stat-command";

async function main(): Promise<void> {
  program.version("0.1.0");
  program
    .command("log")
    .requiredOption("--start <date>", "start date")
    .requiredOption("--end <date>", "end date")
    .requiredOption("--query <search query>", "query for github search")
    .action(logCommand);

  program.command("stat").requiredOption("--input <filepath>").action(statCommand);

  program.parse(process.argv);
}

main().catch((error) => console.error(error));
