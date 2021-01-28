import React from 'react';
import { RouteNode } from '../../modules/router/_components/route-node';
import { Page } from './page';

const pageNode = 'error';

const action = async () => ({
  title: 'error.title',
  Content: () => <RouteNode nodeName={pageNode}>{() => <Page />}</RouteNode>,
});

export default action;
