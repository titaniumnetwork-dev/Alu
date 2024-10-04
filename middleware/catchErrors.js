import chalk from "chalk";

process.on("uncaughtException", (err) => {
    console.log(chalk.red("[Alu] Uncaught exception!", err));
    process.exit(1);
});