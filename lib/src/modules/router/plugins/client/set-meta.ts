import { Router, State, Plugin } from 'router5';
import {
  updateMeta,
  updateLink,
  updateCustomMeta,
} from '../../../../_utils/dom';
import { IRouterDependecies } from '../../_types';

export const setMeta = (
  router: Router,
  { getRouteActionResult }: IRouterDependecies,
): Plugin => ({
  onTransitionSuccess: (toState: State): void => {
    const routeActionResult = getRouteActionResult(toState.name);

    const title = routeActionResult.title || 'Boilerplate';

    document.title = title;

    updateCustomMeta('og:image', routeActionResult.ogImage);
    updateCustomMeta('og:url', routeActionResult.ogUrl);
    updateCustomMeta('og:description', routeActionResult.ogDescription);
    updateCustomMeta('og:title', title);

    updateLink('canonical', routeActionResult.canonical);
    updateMeta('keywords', routeActionResult.keywords);
    updateMeta('description', routeActionResult.description);
  },
});
