import { startsWithSegment } from 'router5-helpers';
import { IAdvancedRoute } from '../_types';

export const getRoute = (
  segment: string,
  routes: IAdvancedRoute[],
): IAdvancedRoute | never => {
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    if (route.name === segment) {
      return route;
    }

    if (startsWithSegment(segment, route.name) && route.children) {
      const splitSegment = segment.split('.');
      splitSegment.shift();
      if (splitSegment.length > 0) {
        return getRoute(splitSegment.join('.'), route.children);
      }
    }
  }
  throw new Error('route not found');
};
