import { afterAll, describe, expect, it } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { rmSync, existsSync, statSync } from 'node:fs';
import { MANIFEST_DIRECTORIES, MANIFEST_SAMPLE_FILES, MANIFEST_ROOT } from '@cac/core';
import { scaffoldManifests } from '../src/utils/filesystem.js';

const tempDirs: string[] = [];

const createTempDir = async (): Promise<string> => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'cac-test-'));
  tempDirs.push(dir);
  return dir;
};

afterAll(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('scaffoldManifests', () => {
  it('creates the manifests directory tree with sample files', async () => {
    const targetDir = await createTempDir();

    const manifestsPath = await scaffoldManifests({ targetDir });

    expect(manifestsPath).toBe(path.join(targetDir, MANIFEST_ROOT));
    expect(existsSync(manifestsPath)).toBe(true);

    for (const directory of MANIFEST_DIRECTORIES) {
      const directoryPath = path.join(manifestsPath, directory);
      expect(existsSync(directoryPath)).toBe(true);
      expect(statSync(directoryPath).isDirectory()).toBe(true);

      const sampleFilePath = path.join(directoryPath, MANIFEST_SAMPLE_FILES[directory]);
      expect(existsSync(sampleFilePath)).toBe(true);
      const content = await readFile(sampleFilePath, 'utf-8');
      expect(content).toContain(`# TODO: define ${directory} here`);
    }
  });

  it('throws when manifests already exist without force option', async () => {
    const targetDir = await createTempDir();
    await scaffoldManifests({ targetDir });

    await expect(scaffoldManifests({ targetDir })).rejects.toThrow(/already exists/);
  });
});
