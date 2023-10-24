import { Router } from 'router5';
import { findRouteObject } from './_utils/find-route-object';
import { activateRoute } from './_utils/activate-route';

type ParamsType = {
  routeName: string;
  router: Router;
};

const cachedScripts: Record<string, boolean> = {};

export const routerPrefetcher = async ({ router, routeName }: ParamsType) => {
  try {
    const { routes } = router.getDependencies();

    const { loadAction } = findRouteObject({ routes, routeName }) || {};

    if (!cachedScripts[routeName]) {
      await activateRoute({
        loadAction,
      });

      cachedScripts[routeName] = true;
    }
  } catch (error) {
    console.error('Error in routerPrefetcher');
    console.error(`routeName: ${routeName}`);
    console.error(`error: ${error}`);
  }
};
