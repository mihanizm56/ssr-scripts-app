import { ROUTES } from '@/_constants/routes';

export default {
  name: ROUTES.error.name,
  path: ROUTES.error.path,
  loadAction: () => import(/* webpackChunkName: 'error' */ './index'),
  chunks: ['error'],
};
