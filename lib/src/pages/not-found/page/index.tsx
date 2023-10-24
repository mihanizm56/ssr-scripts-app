import { memo } from 'react';
import styles from './index.module.scss';

export const Page = memo(() => {
  return <div className={styles.Page}>Not found page</div>;
});
