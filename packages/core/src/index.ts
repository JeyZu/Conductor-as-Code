export const MANIFEST_ROOT = 'manifests';

export const MANIFEST_DIRECTORIES = [
  'tasks',
  'workflows',
  'event-handlers',
  'clients',
  'environments'
] as const;

export type ManifestDirectory = (typeof MANIFEST_DIRECTORIES)[number];

export const MANIFEST_SAMPLE_FILES: Record<ManifestDirectory, string> = {
  tasks: 'sample-task.yaml',
  workflows: 'sample-workflow.yaml',
  'event-handlers': 'sample-event-handler.yaml',
  clients: 'sample-client.yaml',
  environments: 'sample-environment.yaml'
};

export interface ScaffoldOptions {
  targetDir: string;
  force?: boolean;
}
