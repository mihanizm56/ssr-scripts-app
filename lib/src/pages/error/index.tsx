import { IAction, RouteNode } from '@wildberries/service-router';
import { ROUTES } from '@/_constants/routes';
import { Page } from './page';

const pageNode = ROUTES.error.pageNode;

const action: IAction = async () => ({
  title: 'Error page',
  content: <RouteNode nodeName={pageNode}>{() => <Page />}</RouteNode>,
});

export default action;
