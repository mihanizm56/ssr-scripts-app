import { constants } from 'router5';
import { ROUTES } from '@/_constants/routes';

export default {
  name: constants.UNKNOWN_ROUTE,
  path: ROUTES['not-found'].path,
  loadAction: () => import(/* webpackChunkName: 'not-found' */ './index'),
  chunks: ['not-found'],
};
