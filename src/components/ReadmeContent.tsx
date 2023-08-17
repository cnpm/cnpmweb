'use client';
import { useReadme } from '@/hooks/useReadme';
import Slugger from 'github-slugger';
import hljs from 'highlight.js';
import marked from 'marked';
import React, { useEffect } from 'react';
import styles from './ReadmeContent.module.css';
import light from './light.module.css';
import dark from './dark.module.css';
import 'highlight.js/styles/github.css';
import { Result, Skeleton, Typography } from 'antd';
import SizeContainer from './SizeContainer';
import { useThemeMode } from 'antd-style';

const slugger = new Slugger();

const renderer = {
  heading(text: string, level: number) {
    const slug = slugger.slug(text);
    return `
            <h${level} class="header-link" id="h-${slug}">
            <a href="#h-${slug}" style="color: inherit;text-decoration: none;">
              ${text}
              </a>
            </h${level}>`;
  },
  link(href: string, title: string, text: string) {
    if (href.startsWith('#')) {
      return `<a href="${href.replace('#', '#h-')}" alt="${title}">${text}</a>`;
    }
    return `<a href="${href}" alt="${title}">${text}</a>`;
  },
  code(code: string, language: string) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    const highlightedCode = hljs.highlight(validLanguage, code).value;
    return `<pre><code class="hljs ${validLanguage}" style="padding: 0;">${highlightedCode}</code></pre>`;
  },
};
marked.use({ renderer });

export function ReadmeContent({name, version = 'latest'}: {name: string; version?: string}) {
  const content = useReadme(name, version);
  const { themeMode } = useThemeMode();

  const contentNode = React.useMemo(() => {
    const loading = content === undefined;
    if (loading) {
      return <Skeleton active />;
    }
    if (typeof content !== 'string') {
      return <Result title="未查询到相关文档信息" />;
    }
    return (
      <div
        className={
          themeMode === 'dark' ? dark['markdown-body'] : light['markdown-body']
        }
        dangerouslySetInnerHTML={{
          __html: marked(content, {
            headerIds: true,
          }),
        }}
      />
    );
}, [content, themeMode]);

useEffect(() => {
  if (location.hash) {
    const el = document.querySelector(`a[href="${location.hash}"]`);
    el?.scrollIntoView();
  }
}, [contentNode]);

return <Typography className={ styles.markdown }> { contentNode } </Typography>;
};

export default function Readme({
  name,
  version,
}: {
  name: string;
  version?: string;
}) {
  return (
    <SizeContainer maxWidth={800} style={{ colorScheme: 'dark' }}>
      <ReadmeContent name={name} version={version} />
    </SizeContainer>
  );
}
