import React, { PropsWithChildren } from 'react';
import { ConnectedLink } from 'react-router5';
import { Router } from 'router5';
import { routerPrefetcher } from '../../modules/router/_utils/router-prefetcher';
import styles from './index.scss';

type PropsType = PropsWithChildren<{ router: Router }>;

export const MainLayout = React.memo(({ children, router }: PropsType) => {
  return (
    <div className={styles.page}>
      <nav>
        <ConnectedLink
          onMouseEnter={() => routerPrefetcher({ router, routeName: 'home' })}
          routeName="home"
        >
          Home
        </ConnectedLink>
        <br />
        <ConnectedLink
          onMouseEnter={() => routerPrefetcher({ router, routeName: 'page1' })}
          routeName="page1"
        >
          Page 1
        </ConnectedLink>
        <br />
        <ConnectedLink
          onMouseEnter={() => routerPrefetcher({ router, routeName: 'page2' })}
          routeName="page2"
        >
          Page 2
        </ConnectedLink>
        <br />
      </nav>
      <div className={styles.content}>{children}</div>
    </div>
  );
});
