import notFound from './not-found/route';
import main from './main/route';

const routes = [main, notFound];

if (__DEV__) {
  // eslint-disable-next-line global-require
  const error = require('./error/route').default;
  routes.push(error);
}

export default routes;
