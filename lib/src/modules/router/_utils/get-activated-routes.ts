import { State, transitionPath } from 'router5';
import { IAdvancedRoute } from '../_types';
import { getRoute } from './get-route';

export const getActivatedRoutes = (
  toState: State,
  fromState: State,
  routes: IAdvancedRoute[],
): IAdvancedRoute[] => {
  const { toActivate } = transitionPath(toState, fromState);
  if (!toActivate.includes(toState.name)) {
    toActivate.push(toState.name);
  }

  return toActivate.map(
    (segment: string): IAdvancedRoute => getRoute(segment, routes),
  );
};
