import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SWRConfig } from 'swr';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReadmeContent } from './ReadmeContent';

afterEach(() => {
  vi.unstubAllGlobals();
});

async function renderReadme(content: string, source = 'manifest') {
  const fetchReadme = vi.fn().mockResolvedValue({ status: 200, text: async () => content });
  vi.stubGlobal('fetch', fetchReadme);
  const result = render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <ReadmeContent
        name="readme-security-fixture"
        content={source === 'manifest' ? content : undefined}
      />
    </SWRConfig>,
  );
  await waitFor(() => expect(result.container.querySelector('.markdown-body')).not.toBeNull());
  if (source === 'registry') {
    expect(fetchReadme).toHaveBeenCalled();
  } else {
    expect(fetchReadme).not.toHaveBeenCalled();
  }
  return result.container.querySelector('.markdown-body')!;
}

describe('ReadmeContent security', () => {
  it.each(['manifest', 'registry'])('sanitizes HTML from the %s README', async (source) => {
    const body = await renderReadme(
      `<p align="center" style="color:red" onclick="void 0">Package documentation</p>
<img src="https://example.test/logo.png" alt="logo" width="120" height="120" style="margin-bottom:10px" onerror="void 0">
<script>void 0</script>
<style>body { display: none }</style>
<iframe src="https://example.test/frame" srcdoc="<p>embedded</p>"></iframe>
<object data="https://example.test/object"></object>
<embed src="https://example.test/embed">
<svg onload="void 0"><a xlink:href="javascript:void(0)">svg</a></svg>
<math><mtext>math</mtext></math>
<form action="https://example.test/submit"><input type="text" name="credential" autofocus onfocus="void 0"></form>`,
      source,
    );

    expect(body).toHaveTextContent('Package documentation');
    expect(body.querySelector('img')).toHaveAttribute('src', 'https://example.test/logo.png');
    expect(body.querySelector('img')).toHaveAttribute('alt', 'logo');
    expect(body.querySelector('script, style, iframe, object, embed, svg, math, form')).toBeNull();
    expect(
      body.querySelector('[align], [style], [width], [height], [srcdoc], [autofocus], [name]'),
    ).toBeNull();
    for (const element of body.querySelectorAll('*')) {
      expect(element.getAttributeNames().some((name) => /^on/i.test(name))).toBe(false);
    }
    for (const input of body.querySelectorAll('input')) {
      expect(input).toHaveAttribute('type', 'checkbox');
      expect(input).toBeDisabled();
    }
  });

  it.each([
    'javascript:void(0)',
    'JaVaScRiPt:void(0)',
    'jav&#x61;script:void(0)',
    'java&#x09;script:void(0)',
    'vbscript:noop',
    'data:text/html,document',
  ])('removes unsafe URLs: %s', async (url) => {
    const body = await renderReadme(
      `<a href="${url}">raw link</a>\n\n[markdown link](${url})\n\n<img src="${url}">`,
    );
    expect(body.querySelectorAll('a')).toHaveLength(2);
    expect(body.querySelector('[href], [src]')).toBeNull();
  });

  it('sanitizes HTML introduced by the custom link and heading renderers', async () => {
    const body = await renderReadme(
      `# Heading <img src="https://example.test/logo.png" onerror="void 0">\n\n[link](https://example.test '" onmouseover="void 0')`,
    );
    expect(body.querySelector('h1 img')).not.toHaveAttribute('onerror');
    expect(body.querySelector('[onmouseover]')).toBeNull();
    expect(body.querySelector('a[href="https://example.test"]')).not.toBeNull();
  });

  it('sanitizes during server rendering too', () => {
    const html = renderToStaticMarkup(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ReadmeContent
          name="server-fixture"
          content={'<p>Server README</p><img src="/logo.png" onerror="void 0">'}
        />
      </SWRConfig>,
    );
    expect(html).toContain('Server README');
    expect(html).toContain('/logo.png');
    expect(html).not.toContain('onerror');
  });

  it('finishes loading when all README content is removed', async () => {
    const body = await renderReadme('<script>void 0</script>');
    expect(body).toBeEmptyDOMElement();
  });

  it('preserves Markdown, safe links, images, task lists and highlighting', async () => {
    const body = await renderReadme(
      [
        '# Readme compatibility',
        '[jump](#readme-compatibility)',
        '**bold** and ~~deleted~~ and `inline`',
        '[website](https://example.test/docs) [email](mailto:maintainer@example.test) [relative](/docs)',
        '![badge](https://example.test/badge.svg "build status")',
        '- [x] complete\n- [ ] pending',
        '| Name | Value |\n| --- | --- |\n| Package | Works |',
        '<details><summary>More</summary>Documentation</details>',
        '```javascript\nconst value = "safe";\n```',
        '```html\n<img src="x" onerror="void 0">\n```',
      ].join('\n\n'),
    );

    const heading = body.querySelector('h1')!;
    expect(heading.id).toBe('h-readme-compatibility');
    expect(body.querySelector('a[href="#h-readme-compatibility"]')).not.toBeNull();
    expect(body.querySelector('strong')).toHaveTextContent('bold');
    expect(body.querySelector('del')).toHaveTextContent('deleted');
    expect(body.querySelector('a[href="https://example.test/docs"]')).not.toBeNull();
    expect(body.querySelector('a[href="mailto:maintainer@example.test"]')).not.toBeNull();
    expect(body.querySelector('a[href="/docs"]')).not.toBeNull();
    expect(body.querySelector('img')).toHaveAttribute('title', 'build status');
    const checkboxes = body.querySelectorAll('input');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled());
    expect(body.querySelector('table tbody td')).toHaveTextContent('Package');
    expect(body.querySelector('details summary')).toHaveTextContent('More');
    expect(body.querySelector('pre code.hljs .hljs-keyword')).toHaveTextContent('const');
    const code = body.querySelectorAll('pre code')[1];
    expect(code).toHaveTextContent('<img src="x" onerror="void 0">');
    expect(code.querySelector('img')).toBeNull();
  });
});
