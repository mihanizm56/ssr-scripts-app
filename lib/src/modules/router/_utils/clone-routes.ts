import { IAdvancedRoute } from '../_types';

export const cloneRoutes = (routes: IAdvancedRoute[]): IAdvancedRoute[] =>
  routes.map(
    (route): IAdvancedRoute => {
      const newRoute = { ...route };
      if (route.children && route.children.length > 0) {
        newRoute.children = cloneRoutes(route.children);
      }

      return newRoute;
    },
  );
