import type { Command } from 'commander';

export const registerHelpCommand = (program: Command): void => {
  program
    .command('help')
    .description('Display help information for cac')
    .action(() => {
      program.help();
    });
};
