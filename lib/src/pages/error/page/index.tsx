import React from 'react';
import styles from './index.scss';

// Компонент должен быть классом так как в client.tsx на него должна быть возможность получить ref

export class Page extends React.PureComponent<React.Props<any>> {
  render() {
    return <div className={styles.page}>500 – Error</div>;
  }
}
