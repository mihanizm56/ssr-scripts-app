import createRouter, { Router } from 'router5';
import loggerPlugin from 'router5-plugin-logger';
import browserPlugin from 'router5-plugin-browser';
import allRoutes from '../../pages/routes';
import { actionHandler } from './middlewares/action-handler';
import { getSegmentActionResult } from './_utils/get-segment-action-result';
import { getRouteActionResult } from './_utils/get-route-action-result';
import { cloneRoutes } from './_utils/clone-routes';
import { IAdvancedRoute } from './_types';

export * from './_types';

export const configureRouter = (store?: any): Router => {
  const routes = cloneRoutes(allRoutes as IAdvancedRoute[]);

  const router = createRouter(routes, {
    defaultParams: {},
    allowNotFound: true,
    caseSensitive: true,
    queryParamsMode: 'loose',
    strongMatching: true,
  });

  // Dependencies
  router.setDependencies({
    routerId: +new Date(),
    routes,
    getSegmentActionResult: getSegmentActionResult(router),
    getRouteActionResult: getRouteActionResult(router),
    store,
  });

  // Plugins
  router.usePlugin(browserPlugin());
  if (__DEV__ && __CLIENT__) {
    router.usePlugin(loggerPlugin);
  }

  // Middlewares
  router.useMiddleware(actionHandler);

  return router;
};
