'use client';
import Editor from '@monaco-editor/react';
import { File, useFileContent } from '@/hooks/useFile';

export const CodeViewer = ({
  selectedFile,
  pkgName,
  spec,
}: {
  selectedFile: File | undefined;
  pkgName: string;
  spec?: string;
}) => {

  const { data: code, isLoading } = useFileContent(
    { fullname: pkgName, spec },
    selectedFile?.path || ''
  );
  let language = selectedFile?.path.split('.').pop();

  if (language === 'js' || language === 'jsx') language = 'javascript';
  else if (language === 'ts' || language === 'tsx') language = 'typescript';

  if (!selectedFile) return null;

  return (
    <div
      style={{
        width: 'calc(100% - 250px)',
        margin: 0,
        fontSize: 16,
      }}
    >
      <Editor
        height='100vh'
        language={language}
        value={code ? code : 'Loading...'}
        theme='vs-light'
        options={{ readOnly: true, fontSize: 16 }}
      />
    </div>
  );
};

export default CodeViewer;
