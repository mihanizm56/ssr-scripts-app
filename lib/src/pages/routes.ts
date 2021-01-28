import home from './home/route';
import page1 from './page1/route';
import page2 from './page2/route';
import notFound from './not-found/route';

const routes = [home, page1, page2, notFound];

if (__DEV__) {
  // eslint-disable-next-line global-require
  const error = require('./error/route').default;
  routes.push(error);
}

export default routes;
