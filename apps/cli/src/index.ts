#!/usr/bin/env node
import { createRequire } from 'node:module';
import { Command } from 'commander';
import { logger } from '@cac/logger';
import { registerHelpCommand } from './commands/help.js';
import { registerInitCommand } from './commands/init.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };

const program = new Command();

program
  .name('cac')
  .description('Conductor as Code command line interface')
  .version(packageJson.version, '-v, --version', 'output the current version');

registerInitCommand(program);
registerHelpCommand(program);

program
  .showHelpAfterError()
  .parseAsync(process.argv)
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    logger.error(message);
    process.exit(1);
  });
