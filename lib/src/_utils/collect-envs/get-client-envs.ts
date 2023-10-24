import { getEnvs } from './get-envs';
import { clientAvailableEnvKeys } from './available-env-keys';

type OutputType = {
  clientStringifiedEnvs: string;
  clientEnvs: Record<string, string>;
};

export const getClientEnvs = (
  initialEnvs?: Record<string, string>,
): OutputType => {
  const clientEnvs = {
    ...initialEnvs,
    ...getEnvs(clientAvailableEnvKeys),
  };

  const clientStringifiedEnvs = Object.keys(clientEnvs).reduce(
    (acc, keyName) => `${acc}${keyName}:"${clientEnvs[keyName]}",`,
    '',
  );

  return {
    clientEnvs,
    clientStringifiedEnvs,
  };
};
