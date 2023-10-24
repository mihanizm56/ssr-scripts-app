import { IAction, RouteNode } from '@wildberries/service-router';
import { ROUTES } from '@/_constants/routes';
import { Page } from './page';

const pageNode = ROUTES.main.pageNode;

const action: IAction = async () => {
  return {
    title: 'Main page',
    content: <RouteNode nodeName={pageNode}>{() => <Page />}</RouteNode>,
  };
};

export default action;
