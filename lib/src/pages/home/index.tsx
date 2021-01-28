import React from 'react';
import { RouteNode } from '../../modules/router/_components/route-node';
import { MainLayout } from '../../_layouts/main-layout';
import { Page } from './page';

const pageNode = 'home';

const action = async ({ router }) => ({
  title: 'home:title',
  Content: () => (
    <MainLayout router={router}>
      <RouteNode nodeName={pageNode}>
        {({ route, content }) => {
          if (route.name === pageNode) {
            return <Page />;
          }

          return content;
        }}
      </RouteNode>
    </MainLayout>
  ),
});

export default action;
