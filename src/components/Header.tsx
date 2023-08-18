import { GithubOutlined } from "@ant-design/icons";
import { Dropdown, Segmented } from "antd";
import { createStyles, cx } from "antd-style";
import Link from "next/link";

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

export default function Header({title, themeMode, setThemeMode}: any) {
  const { styles } = useStyles();
  return (
    <header className={cx(styles.header)}>
      <nav className={styles.container}>
        <span style={{ flex: 1 }}>
          <Link href='/'>
            <img
              src='/cnpm.png'
              width={24}
              alt='logo'
              style={{ marginRight: 8 }}
            />
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
          <Link
            href='https://github.com/cnpm/cnpmweb'
            target='_blank'
            style={{ color: 'inherit' }}
          >
            <Dropdown
              menu={{
                items: [
                  { key: 'cnpmweb', label: <Link target="_blank" href={"https://github.com/cnpm/cnpmweb"}>🪞 cnpmweb</Link> },
                  { key: 'cnpmcore', label: <Link target="_blank" href={"https://github.com/cnpm/cnpmcore"}>📦 cnpmcore</Link> },
                ],
              }}
            >
              <GithubOutlined />
            </Dropdown>
          </Link>
        </span>
      </nav>
    </header>
  );
}
