'use client';
import { CodeViewer } from '@/components/CodeViewer';
import { FileTree } from '@/components/FileTree';
import { Sidebar } from '@/components/Sidebar';
import { useDirs, File } from '@/hooks/useFile';
import { usePathState } from '@/hooks/usePathState';
import { PageProps } from '@/pages/package/[...slug]';
import { Result, Spin } from 'antd';
import { useState } from 'react';

const Viewer = ({ manifest, version }: PageProps) => {
  const [_selectedFile, setSelectedFile] = useState<File | undefined>();
  const [path, setPath] = usePathState(
    `/package/${manifest.name}/files/*?version=${version || 'latest'}`,
  );

  const spec = version || 'latest';

  const {
    data: rootDir,
    isLoading,
    error,
  } = useDirs({
    fullname: manifest.name,
    spec,
  });

  let selectedFile = _selectedFile || { path: `/${path || 'package.json'}`, type: 'file' };

  const onSelect = (file: File) => {
    setSelectedFile(file);
    setPath(file.path);
  };

  if (isLoading) {
    return (
      <Spin
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }

  return error ? (
    <Result status="warning" title="产物预览失败" subTitle={error} />
  ) : (
    <div style={{ display: 'flex', marginTop: -16, minHeight: '100%' }}>
      <Sidebar>
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={onSelect}
          pkgName={manifest.name}
          spec={spec}
        />
      </Sidebar>
      <CodeViewer selectedFile={selectedFile} pkgName={manifest.name} spec={spec} />
    </div>
  );
};

export default Viewer;
