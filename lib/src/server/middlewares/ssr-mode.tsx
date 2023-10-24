/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-props-no-spreading */

import { IncomingMessage, ServerResponse } from 'http';
import { renderToString } from 'react-dom/server';
import { cloneRouter, Router } from 'router5';
import {
  configureRouter,
  IActionResult,
  IAdvancedRoute,
} from '@wildberries/service-router';
// Файл chunk-manifest.json генерируется при сборке и позволяет мапить чанки для сервера и клиента по роутам
import { getChunks } from '@/_utils/router/_utils/get-chunks';
import { actionHandler } from '@/_utils/router/middlewares/action-handler';
import routes from '@/pages/routes';
import { App } from '@/_components/app';
import {
  SSRHtml,
  SSRHtmlPropsType,
} from '@/_components/html/_components/ssr-html';
import { getClientEnvs as getClientGlobalEnvs } from '@/_utils/collect-envs/get-client-envs';
import { collectRouteChunks } from '../_utils/collect-route-chunks';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved

// Базовый объект роутера
const baseRouter: Router = configureRouter({
  customActionHandler: actionHandler,
  routes,
  allowNotFound: true,
  queryParamsMode: 'default',
});

baseRouter.setDependencies({
  getChunks: getChunks(baseRouter),
});

const isProduction = process.env.NODE_ENV === 'production';

type ParamsType = {
  request: IncomingMessage;
  response: ServerResponse;
  cookies: any;
};

export const ssrMode = ({
  request,
  response,
  cookies,
}: ParamsType): Promise<void> =>
  new Promise(async (resolveApp) => {
    // Клонирование базового роутера для обработки запроса
    const router = cloneRouter(baseRouter, baseRouter.getDependencies());

    router.setDependencies({
      cookies,
    });

    const { clientStringifiedEnvs } = getClientGlobalEnvs({});

    // Обработка пути с router5
    const route: IAdvancedRoute = await new Promise(
      (resolveRoute, rejectRoute) => {
        router.start(request.url, (error, state) => {
          if (error?.actionResult?.redirect) {
            // Обработка редиректа
            const { redirect } = error.actionResult;

            const redirectUrl =
              redirect.route && redirect.route.name
                ? router.buildPath(
                    redirect.route.name,
                    redirect.route.params || {},
                  )
                : redirect.url;

            if (isProduction) {
              response.writeHead(redirect.status || 302, {
                Location: redirectUrl,
              });
              response.write('redirect');
              response.end();
            } else {
              // @ts-ignore
              response.redirect(redirect.status || 302, redirectUrl);
            }

            resolveApp();
          } else if (error) {
            rejectRoute(new Error(error.code));
          } else {
            resolveRoute(state as IAdvancedRoute);
          }
        });
      },
    );

    const routerDeps = router.getDependencies();

    // Результат выполнения экшена текущего роута
    const routeActionResult: IActionResult = routerDeps.getRouteActionResult(
      route.name,
    );

    // Определение чанков скриптов и стилей для текущего роута (NOT FOR CURRENT SSR BECAUSE BOT DONT NEED THIS)
    // (набивка чанков стилей и скриптов из манифеста chunk-manifest.json)
    const { styles, scripts } = collectRouteChunks({
      chunks,
      routeChunks: routerDeps.getChunks(route.name) || [],
    });

    // данные для проброса на клиент
    const ssrData = {};

    const renderedApp = renderToString(
      <App cookies={cookies} router={router} />,
    );

    // Данные для отрисовки html страницы
    const data: Omit<SSRHtmlPropsType, 'children'> = {
      title: routeActionResult.title,
      description: routeActionResult.description,
      keywords: routeActionResult.keywords,
      canonical: routeActionResult.canonical,
      ogDescription: routeActionResult.ogDescription,
      ogUrl: routeActionResult.ogUrl,
      ogImage: routeActionResult.ogImage,
      styles,
      ssrFormattedData: JSON.stringify(ssrData),
      scripts,
      clientEnvs: clientStringifiedEnvs,
    };

    const contentHTML = renderToString(
      <SSRHtml {...data}>{renderedApp}</SSRHtml>,
    );

    const html = `<!doctype html>${contentHTML}`;

    if (isProduction) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(html);
      response.end();
    } else {
      // @ts-ignore
      response.send(html);
    }

    resolveApp();
  });
