import React from 'react';
import { MainLayout } from '../../_layouts/main-layout';
import { RouteNode } from '../../modules/router/_components/route-node';
import { Page } from './page';

const pageNode = 'not-found';

const action = async ({ router }) => ({
  title: 'not-found',
  status: 404,
  Content: () => (
    <MainLayout router={router}>
      <RouteNode nodeName={pageNode}>{() => <Page />}</RouteNode>
    </MainLayout>
  ),
});

export default action;
