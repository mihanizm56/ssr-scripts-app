import { Component, PropsWithChildren } from 'react';
import { withRoute } from 'react-router5';
import { Route } from 'router5';
import { ErrorPage } from '../error-page';

type StateType = {
  hasError: boolean;
};

type PropsType = PropsWithChildren<{
  route: Route;
}>;

class WrappedComponent extends Component<PropsType, StateType> {
  static getDerivedStateFromError() {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidUpdate(prevProps: PropsType) {
    const { route: previousRoute } = prevProps;
    const { route: currentRoute } = this.props;

    if (
      previousRoute &&
      currentRoute &&
      previousRoute.name !== currentRoute.name
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    console.error('Components stack with error', error);
  }

  render() {
    return !this.state.hasError ? this.props.children : <ErrorPage />;
  }
}

// todo fix any
export const ErrorBoundary = withRoute(WrappedComponent as any);
