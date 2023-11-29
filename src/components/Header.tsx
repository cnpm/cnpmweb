import { useRecent } from '@/hooks/useRecent';
import { GithubOutlined } from '@ant-design/icons';
import { Dropdown, Segmented } from 'antd';
import { createStyles, cx } from 'antd-style';
import Link from 'next/link';
import { useEffect } from 'react';

const useStyles = createStyles(({ token, css }) => {
  return {
    container: css`
      height: 3rem;
      display: flex;
      padding-inline-start: 16px;
      align-items: center;
      border-bottom: 1px solid ${token.colorBorderSecondary};
    `,
    header: css`
      border-bottom: 1px solid ${token.colorBorderBg};
    `,
  };
});

export default function Header({ title, themeMode, setThemeMode }: any) {
  const { styles } = useStyles();
  const [recent, setRecent] = useRecent();

  useEffect(() => {
    if (title && recent) {
      const index = recent.indexOf(title);
      if (index !== 0) {
        setRecent(prevRecent => {
          let updatedRecent = [...(prevRecent || [])];
          if (index > 0) {
            // 如果 title 已存在于列表中，但不是第一个元素，先移除它
            updatedRecent.splice(index, 1);
          }
          // 将 title 放到数组最前面
          updatedRecent.unshift(title);
          return updatedRecent;
        });
      }
    }
  }, [title, recent]);

  return (
    <header className={cx(styles.header)}>
      <nav className={styles.container}>
        <span style={{ flex: 1 }}>
          <Link href="/">
            <img src="/cnpm.png" width={24} alt="logo" style={{ marginRight: 16 }} />
          </Link>
          {title}
        </span>
        <span style={{ marginRight: 16 }}>
          <Segmented
            value={themeMode}
            options={[
              { label: '🌞', value: 'light' },
              { label: '🌛', value: 'dark' },
            ]}
            onChange={(v) => {
              setThemeMode(v as 'dark' | 'light');
            }}
          />
        </span>
        <span style={{ marginRight: 80 }}>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'cnpm',
                  label: (
                    <Link target="_blank" href={'https://github.com/cnpm/cnpm'}>
                      🔧 cnpm
                    </Link>
                  ),
                },
                {
                  key: 'cnpmweb',
                  label: (
                    <Link target="_blank" href={'https://github.com/cnpm/cnpmweb'}>
                      🪞 cnpmweb
                    </Link>
                  ),
                },
                {
                  key: 'cnpmcore',
                  label: (
                    <Link target="_blank" href={'https://github.com/cnpm/cnpmcore'}>
                      📦 cnpmcore
                    </Link>
                  ),
                },
                {
                  key: 'rapid',
                  label: (
                    <Link target="_blank" href={'https://github.com/cnpm/rapid'}>
                      🚀 rapid
                    </Link>
                  ),
                },
              ],
            }}
          >
            <GithubOutlined />
          </Dropdown>
        </span>
      </nav>
    </header>
  );
}
