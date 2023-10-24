import { constants } from 'router5';

export const ROUTES = {
  main: {
    name: 'main',
    path: '/',
    pageNode: 'main',
  },
  error: {
    name: 'error',
    path: '/error',
    pageNode: 'error',
  },
  'not-found': {
    name: constants.UNKNOWN_ROUTE,
    path: '/not-found',
    pageNode: constants.UNKNOWN_ROUTE,
  },
};
