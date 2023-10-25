import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        fontSize: 14,
        color: 'rgb(102, 102, 102)',
        paddingBottom: 16,
      }}
    >
      <span>Copyright &copy; npmmirror.com</span>
      <span> | </span>
      <Link
        href="https://beian.miit.gov.cn/"
        target="_blank"
        style={{
          color: '#2db7f5',
          textDecoration: 'none',
          outline: 'none',
        }}
      >
        浙ICP备15033595号-63
      </Link>
    </footer>
  );
}
