import { PureComponent } from 'react';
import { withRouter } from 'react-router5';
import { ErrorBoundaryPage } from './_components/error-boundary-page';

// Компонент должен быть классом так как на него должна быть возможность получить ref
export class WrappedComponent extends PureComponent {
  render() {
    return <ErrorBoundaryPage />;
  }
}

export const Page = withRouter<any>(WrappedComponent);
