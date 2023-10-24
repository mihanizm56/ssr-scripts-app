import { IAction, RouteNode } from '@wildberries/service-router';
import { ROUTES } from '@/_constants/routes';
import { Page } from './page';

const pageNode = ROUTES['not-found'].pageNode;

const action: IAction = async () => ({
  title: 'Not found',
  content: <RouteNode nodeName={pageNode}>{() => <Page />}</RouteNode>,
});

export default action;
