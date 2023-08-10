import { ReactNode } from 'react';

export const Sidebar = ({ children }: { children: ReactNode }) => {
  return (
    <aside
      style={{
        overflow: 'auto',
        display: 'block',
        width: '20%',
        height: '100vh',
        borderRight: '2px solid',
        borderColor: '#eee',
        paddingTop: 3,
        maxWidth: 400,
      }}
    >
      {children}
    </aside>
  );
};
