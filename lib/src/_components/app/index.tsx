import React from 'react';
import { Router as IRouter } from 'router5';
import { RouterProvider } from 'react-router5';
import { RouteNode } from '../../modules/router/_components/route-node';
import { ICookies, CookiesContext } from '../../modules/cookies';
import { RootComponents } from '../root-components';
import { ErrorBoundary } from '../error-boundary';
import '../../styles/global.css';
import 'reset-css';
import 'normalize.css';
import { IActionResult } from '../../modules/router';

interface IProps {
  cookies: ICookies;
  router: IRouter;
}

interface IState {
  error?: Error;
}

export class App extends React.PureComponent<IProps, IState> {
  render() {
    const { routerId } = this.props.router.getDependencies();

    return (
      <ErrorBoundary>
        <CookiesContext.Provider value={this.props.cookies}>
          <RouterProvider key={routerId} router={this.props.router}>
            <RouteNode nodeName="">
              {({ Content }: IActionResult) => Content()}
            </RouteNode>
          </RouterProvider>
        </CookiesContext.Provider>

        <RootComponents />
      </ErrorBoundary>
    );
  }
}
