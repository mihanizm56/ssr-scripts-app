import { Response, NextFunction, Request } from 'express';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { cloneRouter, Router } from 'router5';
import { actionHandler } from '../../../modules/router/middlewares';
import { getChunks } from '../../../modules/router/_utils';
import { configureCookies } from '../../../modules/cookies';
import { Html, PropsType as IHtmlProps } from '../../../_components/html';
import { App } from '../../../_components/app';
// Файл chunk-manifest.json генерируется при сборке и позволяет мапить чанки для сервера и клиента по роутам
import {
  configureRouter,
  IAdvancedRoute,
  IActionResult,
} from '../../../modules/router';
import routes from '../../../pages/routes';
import { getClientEnvs as getClientGLobalEnvs } from '../../_utils/collect-envs/get-client-envs';
import { collectRouteChunks } from '../../_utils/collect-route-chunks';
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved

// Базовый объект роутера
const baseRouter: Router = configureRouter({
  customActionHandler: actionHandler,
  routes,
  defaultRoute: 'home',
});

baseRouter.setDependencies({
  getChunks: getChunks(baseRouter),
});

export const ssr = () => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Конфигрурирование cookies
    const cookies = configureCookies(req, res);
    const clientEnvs = getClientGLobalEnvs();

    // Клонирование базового роутера для обработки запроса
    const router = cloneRouter(baseRouter, baseRouter.getDependencies());
    router.setDependencies({
      cookies,
    });

    // Обработка пути с router5
    const route: IAdvancedRoute = await new Promise((resolve, reject) => {
      router.start(req.url, (error, state) => {
        if (error && error.actionResult && error.actionResult.redirect) {
          // Обработка редиректа
          const { redirect } = error.actionResult;
          let redirectUrl = redirect.url;

          if (redirect.route && redirect.route.name) {
            redirectUrl = router.buildPath(
              redirect.route.name,
              redirect.route.params || {},
            );
          }
          res.redirect(redirect.status || 302, redirectUrl);
        } else if (error) {
          reject(new Error(error.code));
        } else {
          resolve(state as IAdvancedRoute);
        }
      });
    });

    const routerDeps = router.getDependencies();

    // Результат выполнения экшена текущего роута
    const routeActionResult: IActionResult = routerDeps.getRouteActionResult(
      route.name,
    );

    // Определение чанков скриптов и стилей для текущего роута
    // (набивка чанков стилей и скриптов из манифеста chunk-manifest.json)
    const { scripts, styles, inlineStyles } = collectRouteChunks({
      chunks,
      routeChunks: routerDeps.getChunks(route.name) || [],
    });

    try {
      // данные для проброса на клиент
      const ssrData = {};

      // Данные для отрисовки html страницы
      const data: IHtmlProps = {
        title: routeActionResult.title,
        description: routeActionResult.description,
        keywords: routeActionResult.keywords,
        canonical: routeActionResult.canonical,
        ogDescription: routeActionResult.ogDescription,
        ogUrl: routeActionResult.ogUrl,
        ogImage: routeActionResult.ogImage,
        styles,
        inlineStyles,
        scripts,
        ssrData,
        clientEnvs,
      };

      // отдаем декларацию первой
      res.write('<!doctype html>');

      // рендер самой html страницы в поток и отдача браузеру
      renderToNodeStream(
        <Html {...data}>
          <App cookies={cookies} router={router} />
        </Html>,
      ).pipe(res);
    } catch (error) {
      next(error);
    }
  } catch (err) {
    next(err);
  }
};
