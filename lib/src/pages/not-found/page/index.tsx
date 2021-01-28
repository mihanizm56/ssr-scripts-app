import React from 'react';
import styles from './index.scss';

export const Page = React.memo(() => {
  return <div className={styles.page}>404 – Not Found</div>;
});
