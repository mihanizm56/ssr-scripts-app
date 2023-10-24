import { ROUTES } from '@/_constants/routes';

export default {
  name: ROUTES.main.name,
  path: ROUTES.main.path,
  loadAction: () => import(/* webpackChunkName: 'main' */ './index'),
  chunks: ['main'],
};
