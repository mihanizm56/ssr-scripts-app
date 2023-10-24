import { serverAvailableEnvKeys } from './available-env-keys';
import { getEnvs } from './get-envs';

const DEFAULT_PORT = '3000';

export const setServerEnvs = () => {
  const envs = getEnvs(serverAvailableEnvKeys);

  if (!envs.PORT) {
    envs.PORT = DEFAULT_PORT;
  }

  (global as any).env = envs;
};
