import { Router } from 'router5';
import { getRoute } from './get-route';

export const getChunks = (router: Router): ((name: string) => string[]) => (
  name: string,
): string[] => {
  const { routes } = router.getDependencies();
  const segments = name.split('.');
  const path = [];

  return segments.reduce((acc, segment): string[] => {
    path.push(segment);
    const route = getRoute(path.join('.'), routes);

    return [...acc, ...(route.chunks || [])];
  }, []);
};
