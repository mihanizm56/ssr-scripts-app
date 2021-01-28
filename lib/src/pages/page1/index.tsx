import React from 'react';
import { RouteNode } from '../../modules/router/_components/route-node';
import { MainLayout } from '../../_layouts/main-layout';
import { Page } from './page';

const pageNode = 'page1';

const action = async ({ fromState, store, toState, router }) => {
  return {
    title: 'page1:title',
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
  };
};

export default action;
