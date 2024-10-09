'use client';
import Editor from '@monaco-editor/react';
import loader from '@monaco-editor/loader';
import { File, useFileContent } from '@/hooks/useFile';
import useHighlightHash, { parseHash } from '@/hooks/useHighlightHash';
import { useThemeMode } from 'antd-style';
import { useRef } from 'react';
import { REGISTRY } from '@/config';

const LinkField = ['devDependencies', 'dependencies', 'peerDependencies', 'optionalDependencies', 'bundleDependencies'];

loader.config({
  paths: {
    vs: `${REGISTRY}/monaco-editor/0.52.0/files/min/vs`,
  },
});

function highlightEditor(editor: any) {
  const [start, end] = parseHash(window.location.hash?.replace('#', ''));
  if (start !== null && window) {
    editor.setSelection(new (window as any).monaco.Range(start, 1, end, 1));
  }
}

function registerLinkProvider(monaco: any) {
  monaco.languages.registerLinkProvider('json', {
    provideLinks: (model: any) => {
      const links:any= [];
      const lines = model.getLinesContent();
      let startCatch = false;
      lines.forEach((line: string, lineIndex: number) => {
        if (LinkField.some( _ => line === `  "${_}": {`)) {
          startCatch = true;
          return;
        }
        if (line === '  },' && startCatch) {
          startCatch = false;
          return;
        }
        if (startCatch) {
          const match = line.match(/"(.+?)": "(.+?)"/);
          if (match?.[1] && match?.[2]) {
            links.push({
              range: new monaco.Range(
                lineIndex + 1,
                line.split('').findIndex((_) => _.trim()) + 1,
                lineIndex + 1,
                line.length,
              ),
              url: `https://npmmirror.com/package/${match[1]}/files?version=${match[2]}`,
            });
          }
        }
      });
      return { links };
    }
  });
}

export const CodeViewer = ({
  selectedFile,
  pkgName,
  spec,
}: {
  selectedFile: File | undefined;
  pkgName: string;
  spec?: string;
}) => {
  const editorRef = useRef<any>(null);
  const { themeMode: theme } = useThemeMode();

  const { data: code } = useFileContent({ fullname: pkgName, spec }, selectedFile?.path || '');

  let language = selectedFile?.path.split('.').pop();
  if (language === 'js' || language === 'jsx' || language === 'map') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';
  else if (language === 'md') language = 'markdown';

  const [_, setRange] = useHighlightHash();

  const handleEditorMouseDown = () => {
    const { startLineNumber, endLineNumber } = editorRef.current.getSelection();

    if (startLineNumber) {
      setRange(startLineNumber, endLineNumber);
    }
  };

  if (!selectedFile) return <></>;

  return (
    <div
      style={{
        width: 'calc(100% - 250px)',
        margin: 0,
        fontSize: 16,
      }}
    >
      <Editor
        height="100vh"
        value={code ? code : 'Loading...'}
        language={language}
        theme={`vs-${theme}`}
        options={{ readOnly: true, fontSize: 16 }}
        beforeMount={registerLinkProvider}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.onMouseUp(handleEditorMouseDown);
          highlightEditor(editor);
        }}
      />
    </div>
  );
};

export default CodeViewer;
