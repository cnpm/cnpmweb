import { createStyles } from 'antd-style';
import { ReactNode } from 'react';

const useStyles = createStyles(({ token, css }) => {
  return {
    border: css`
      border-right: 2px solid ${token.colorBorder};
    `,
  };
});

export const Sidebar = ({ children }: { children: ReactNode }) => {
  const { styles } = useStyles();
  return (
    <aside
      className={styles.border}
      style={{
        overflow: 'auto',
        display: 'block',
        width: '20%',
        height: '100vh',
        paddingTop: 3,
        maxWidth: 400,
      }}
    >
      {children}
    </aside>
  );
};
