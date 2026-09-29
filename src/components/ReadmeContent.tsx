'use client';
import { useReadme } from '@/hooks/useReadme';
import Slugger from 'github-slugger';
import hljs from 'highlight.js';
import { marked, RendererObject } from 'marked';
import sanitizeHtml from 'sanitize-html';
import React, { useEffect, useState, useMemo } from 'react';
import darkTheme from './dark.module.css';
import lightTheme from './light.module.css';
import styles from './ReadmeContent.module.css';
import { Result, Skeleton, Typography } from 'antd';
import SizeContainer from './SizeContainer';
import { useThemeMode } from 'antd-style';

const slugger = new Slugger();

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'del', 'details', 'summary', 'input']),
  allowedAttributes: {
    a: ['href', 'title'],
    img: ['src', 'alt', 'title'],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    h5: ['id'],
    h6: ['id'],
    ol: ['start'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    details: ['open'],
    input: ['type', 'checked', 'disabled'],
  },
  allowedClasses: {
    '*': ['header-link'],
    code: ['hljs', 'language-*'],
    span: ['hljs-*', 'language_', 'class_', 'inherited__', 'function_'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: {
    input: sanitizeHtml.simpleTransform('input', { type: 'checkbox', disabled: '' }),
  },
};

const renderer: RendererObject = {
  heading({ tokens, depth: level }) {
    const text = this.parser.parseInline(tokens);
    const slug = slugger.slug(text);
    return `
            <h${level} class="header-link" id="h-${slug}">
            <a href="#h-${slug}">
              ${text}
              </a>
            </h${level}>`;
  },
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    if (href.startsWith('#')) {
      return `<a href="${href.replace('#', '#h-')}" alt="${title}">${text}</a>`;
    }
    return `<a href="${href}" alt="${title}">${text}</a>`;
  },
  code({ text, lang: language = 'plaintext' }) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    const highlightedCode = hljs.highlight(text, { language: validLanguage }).value;
    return `<pre><code class="hljs language-${validLanguage}">${highlightedCode}</code></pre>`;
  },
};
marked.use({ renderer });

export function ReadmeContent({ name, version = 'latest', content }: { name: string; version?: string; content?: string }) {
  const readme = useReadme(name, version, content);
  const { themeMode } = useThemeMode();
  const [processedHtml, setProcessedHtml] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Use useMemo for the markdown processing logic
  const markdownProcessor = useMemo(() => {
    if (typeof readme !== 'string') {
      setProcessedHtml(null);
      setHasError(false);
      return;
    }

    const processMarkdown = async () => {
      try {
        const result = marked(readme, { gfm: true });
        const html = result instanceof Promise ? await result : result;
        // Sanitize after every renderer (including highlighting) and before writing to the DOM.
        setProcessedHtml(sanitizeHtml(html, sanitizeOptions));
        setHasError(false);
      } catch (error) {
        console.error('Error processing markdown:', error);
        setProcessedHtml(null);
        setHasError(true);
      }
    };

    processMarkdown();
  }, [readme]);

  const contentNode = React.useMemo(() => {
    const loading = readme === undefined;
    if (loading) {
      return <Skeleton active />;
    }
    if (typeof readme !== 'string') {
      return <Result title="未查询到相关文档信息" />;
    }
    if (hasError) {
      return <Result title="文档处理失败" subTitle="Markdown 解析错误" />;
    }
    if (processedHtml === null) {
      return <Skeleton active />;
    }
    return (
      <div className={themeMode === 'dark' ? darkTheme.dark : lightTheme.light}>
        <div
          className={`markdown-body ${styles.markdown}`}
          dangerouslySetInnerHTML={{
            __html: processedHtml,
          }}
        />
      </div>
    );
  }, [readme, themeMode, processedHtml, hasError]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(`a[href="${location.hash}"]`);
      el?.scrollIntoView();
    }
  }, [contentNode]);

  return <Typography> {contentNode} </Typography>;
}

export default function Readme({
  name,
  version,
  content,
}: {
  name: string;
  version?: string;
  content?: string;
}) {
  return (
    <SizeContainer maxWidth={800} style={{ colorScheme: 'dark' }}>
      <ReadmeContent name={name} version={version} content={content}/>
    </SizeContainer>
  );
}
