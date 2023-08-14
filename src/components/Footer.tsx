import Link from "next/link";

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
        href='https://beian.miit.gov.cn/'
        target='_blank'
        style={{
          color: '#2db7f5',
          background: 'transparent',
          textDecoration: 'none',
          outline: 'none',
        }}
      >
        浙ICP备15033595号-63
      </Link>
      <script
        type='text/javascript'
        dangerouslySetInnerHTML={{
          __html: `var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_5874717'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s22.cnzz.com/stat.php%3Fid%3D5874717%26online%3D1%26show%3Dline' type='text/javascript'%3E%3C/script%3E"));</script><script>(function() { $("body").attr("data-spm", "24755359"); $("head").append("<meta name=\"data-spm\" content=\"a2c6h\">"); })();</script> <script type="text/javascript" nonce="81dd15b10fc44ca4bba7c8b2b17b6f53">  (function  (d)  { var  t=d.createElement("script");t.type="text/javascript";t.async=true;t.id="tb-beacon-aplus";t.setAttribute("exparams","category=&userid=&aplus&yunid=&yunpk=&channel=&cps=");t.src="//g.alicdn.com/alilog/mlog/aplus_v2.js";d.getElementsByTagName("head")[0].appendChild(t);})(document);`,
        }}
      ></script>
    </footer>
  );
}
