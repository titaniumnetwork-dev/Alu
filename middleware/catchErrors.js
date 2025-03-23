import chalk from "chalk";

process.on("uncaughtException", (err) => {
  console.log(chalk.bold.red(`[Pyrus] Caught error!\n${err.stack}`));
  process.exit(1);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.log(chalk.bold.red(`[Pyrus] Caught error!\n${err.stack}`));
  process.exit(1);
});
