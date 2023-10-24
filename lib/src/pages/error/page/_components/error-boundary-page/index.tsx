import { memo } from 'react';
import styles from './index.module.scss';

export const ErrorBoundaryPage = memo(() => {
  return <div className={styles.Page}>ErrorBoundaryPage</div>;
});
