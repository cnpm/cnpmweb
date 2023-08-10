'use client';
import { useReadme } from '@/hooks/useReadme';
import 'github-markdown-css/github-markdown-light.css';
import Slugger from 'github-slugger';
import hljs from 'highlight.js';
import marked from 'marked';
import React, { useEffect } from 'react';
import styles from './ReadmeContent.module.css';

import 'highlight.js/styles/github.css';
import { Card, Result, Skeleton, Typography } from 'antd';
import SizeContainer from './SizeContianer';

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

export function ReadmeContent({name, version = 'latest'}: {name: string; version: string}) {
  const content = useReadme(name, version);

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
        className= "markdown-body"
    dangerouslySetInnerHTML = {{
      __html: marked(content, {
        headerIds: true,
      }),
        }
  }
      />
  );
}, [content]);

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
  version: string;
}) {
  return (
    <SizeContainer maxWidth={'100%'}>
      <ReadmeContent name={name} version={version} />
    </SizeContainer>
  );
}
