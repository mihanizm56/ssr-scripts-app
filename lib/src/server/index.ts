/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-import-module-exports */
import path from 'path';
import dotenv from 'dotenv';
import { configureCookies } from '@/_utils/cookies';
import { IApplicationServer } from '@/_types';
import { setServerEnvs as setServerGlobalEnvs } from '../_utils/collect-envs/set-server-envs';
import { initProcessListeners } from './_utils/init-process-listeners';
import { createHttpServer } from './_utils/create-http-server';
import { pureStaticServer } from './_utils/static-server';
import { spaMode } from './middlewares/spa-mode';
import { ssrMode } from './middlewares/ssr-mode';

initProcessListeners();

// process.env.NODE_ENV is set by webpack before dotenv setup
export const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  dotenv.config();
  dotenv.config({ path: path.join(__dirname, '..', 'external-envs.env') });
} else {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
}

setServerGlobalEnvs();

const { FULL_SSR_ACTIVE } = process.env;

export const isFullSSRActive = Boolean(FULL_SSR_ACTIVE);

const app: IApplicationServer = async (request, response) => {
  if (isProduction) {
    // in prod we send pure files without any libs
    const isStaticFile = /(\/static)|(sw\.js)|(assetlinks\.json)/.test(
      request.url,
    );

    if (isStaticFile) {
      pureStaticServer({ request, response });

      return;
    }

    response.setHeader('etag', 'false');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/html');
  } else {
    // @ts-ignore
    response.set({
      etag: 'false',
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html',
    });
  }

  const cookies = await configureCookies(request, response);

  const ssrParams = {
    request,
    response,
    cookies,
  };

  if (isFullSSRActive) {
    ssrMode(ssrParams);

    return;
  }

  spaMode(ssrParams);
};

// Автоматический перезапуск сервера при изменениях в файлах
// В режиме Hot Module Replacement на сервере
if (module.hot) {
  (app as any).hot = module.hot;
  module.hot.decline();
}

// Запуск сервера
if (!module.hot) {
  try {
    await createHttpServer(app);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default app;

export { setupProxy } from '../setupProxy';
