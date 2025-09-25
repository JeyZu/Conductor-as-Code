import type { Command } from 'commander';
import { logger } from '@cac/logger';
import { scaffoldManifests } from '../utils/filesystem.js';

interface InitCommandOptions {
  force?: boolean;
}

export const registerInitCommand = (program: Command): void => {
  program
    .command('init')
    .description('Scaffold the manifests directory structure')
    .option('-f, --force', 'Overwrite existing manifest files when present', false)
    .action(async (options: InitCommandOptions) => {
      try {
        const manifestsPath = await scaffoldManifests({
          targetDir: process.cwd(),
          force: options.force,
        });
        logger.info(`Manifests initialized at ${manifestsPath}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger.error(message);
        process.exitCode = 1;
      }
    });
};
