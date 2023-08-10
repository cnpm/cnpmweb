'use client';
import { CodeViewer } from "@/components/CodeViewer";
import { FileTree } from "@/components/FileTree";
import { Sidebar } from "@/components/Sidebar";
import { useDirs, File } from "@/hooks/useFile";
import { Spin } from "antd";
import { useState } from "react";
import { PageProps } from "../page";

const Viewer = ({ manifest, version }: PageProps) => {
  const [_selectedFile, setSelectedFile] = useState<File | undefined>();
  const { data: rootDir, isLoading } = useDirs({
    fullname: manifest.name,
    spec: version || 'latest',
  });

  const selectedFile =
    _selectedFile ||
    rootDir?.files?.find((item: File) => item?.path === '/package.json');

  const onSelect = (file: File) => setSelectedFile(file);

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

  return (
    <div style={{ display: 'flex', marginTop: -16 }}>
      <Sidebar>
        <FileTree
          rootDir={rootDir}
          selectedFile={selectedFile}
          onSelect={onSelect}
        />
      </Sidebar>
      <CodeViewer
        selectedFile={selectedFile}
        pkgName={manifest.name}
        spec={version}
      />
    </div>
  );
};

export default Viewer;
