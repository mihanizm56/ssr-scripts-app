import * as React from 'react';
import { Router, State } from 'router5';
import { RouteNode as Router5RouteNode } from 'react-router5';

interface IProps extends React.Props<any> {
  nodeName: string;
  children: (params: {
    router: Router;
    route: State;
    content: React.ReactNode;
    Content: () => React.ReactNode;
  }) => React.ReactNode;
}

/**
 * Wrapped RouteNode from router5
 */
export const RouteNode = ({ nodeName, children }: IProps) => (
  <Router5RouteNode key={nodeName} nodeName={nodeName}>
    {({ router, route }: { router: Router; route: State }) => {
      // В IOS при закрытии Safari с вкладкой сайта и последующем переоткрытии
      // в route на клиенте сначала приходит undefined
      if (!route) {
        return null;
      }

      const DI = router.getDependencies();
      const actionResult = DI.getSegmentActionResult(route.name, nodeName);

      return children({
        router,
        route,
        content: actionResult && actionResult.content,
        Content: actionResult && actionResult.Content,
      });
    }}
  </Router5RouteNode>
);
