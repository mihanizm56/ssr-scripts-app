import { PureComponent } from 'react';
import { Router as IRouter } from 'router5';
import { RouterProvider } from 'react-router5';
import { RouteNode } from '@wildberries/service-router';
import { ICookies } from '@/_utils/cookies/_types';
import { CookiesContext } from '@/_utils/cookies/_components/cookies-context';
import { ErrorBoundary } from '../error-boundary';

import '@/styles/global.css';

type PropsType = {
  cookies: ICookies;
  router: IRouter;
};

type StateType = {
  error?: Error;
};

export class App extends PureComponent<PropsType, StateType> {
  render() {
    const { routerId } = this.props.router.getDependencies();

    return (
      <ErrorBoundary>
        <CookiesContext.Provider value={this.props.cookies}>
          <RouterProvider key={routerId} router={this.props.router}>
            <RouteNode nodeName="">
              {({ Content, content }) => content || Content()}
            </RouteNode>
          </RouterProvider>
        </CookiesContext.Provider>
      </ErrorBoundary>
    );
  }
}
