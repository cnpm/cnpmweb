import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';

const MyDocument = () => (
  <Html lang='zh-cn'>
    <Head>
      <script async src={'https://ur.alipay.com/tracert_a4084.js'} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.TracertCmdCache=window.TracertCmdCache||[];var t=window.Tracert||{_isRenderInit:!0,call:function(){window.TracertCmdCache.push(arguments)}},f=["call","start","config","logPv","info","err","click","expo","pageName","pageState","time","timeEnd","parse","checkExpo","stringify","report","set","before"];for(let i=0;i<f.length;i++){(function(fn){t[fn]=function(){var a=[],l=arguments.length;for (var j=0;j<l;j++) {a.push(arguments[j])}a.unshift(fn);window.TracertCmdCache.push(a)}})(f[i])}window.Tracert=t;window._to=window._to||{};
          window.Tracert.start({});
          `,
        }}
      />
    </Head>
    <body style={{ minWidth: 1280 }}>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
