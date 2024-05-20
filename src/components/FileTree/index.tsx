import React, { useState } from 'react';
import { getIcon } from './icon';
import { useDirs, type Directory, type File } from '@/hooks/useFile';
import { createStyles } from 'antd-style';
import { LoadingOutlined } from '@ant-design/icons';

const useStyles = createStyles(({ token, css }) => {
  return {
    selected: css`
      background: ${token.colorBorderSecondary};
    `,
  };
});

interface FileTreeProps {
  rootDir: Directory; // 根目录
  selectedFile: File | undefined; // 当前选中文件
  onSelect: (file: File) => void; // 更改选中时触发事件
  pkgName: string;
  spec: string;
}

export const FileTree = (props: FileTreeProps) => {
  return <SubTree directory={props.rootDir} {...props} />;
};

interface SubTreeProps {
  directory: Directory; // 根目录
  selectedFile: File | undefined; // 当前选中文件
  onSelect: (file: File) => void; // 更改选中时触发事件
  pkgName: string;
  spec: string;
}

const SubTree = (props: SubTreeProps) => {
  return (
    <div>
      {props.directory.files
        // .sort((item) => (item.type === 'directory' ? -1 : 1))
        ?.map((item) => (
          <React.Fragment key={item.path}>
            {item.type === 'directory' ? (
              <DirDiv
                directory={item as Directory}
                selectedFile={props.selectedFile}
                onSelect={props.onSelect}
                pkgName={props.pkgName}
                spec={props.spec}
              />
            ) : (
              <FileDiv
                file={item}
                selectedFile={props.selectedFile}
                onClick={() => props.onSelect(item as File)}
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

const FileDiv = ({
  file,
  icon,
  selectedFile,
  onClick,
  isLoading,
}: {
  file: File | Directory; // 当前文件
  icon?: string; // 图标名称
  selectedFile: File | undefined; // 选中的文件
  onClick: () => void; // 点击事件
  isLoading?: boolean;
}) => {
  const isSelected = (selectedFile && selectedFile.path === file.path) as boolean;
  const pathArray = file.path.split('/');
  const depth = pathArray.length;
  const name = pathArray[pathArray.length - 1];
  const { styles } = useStyles();
  return (
    <div
      className={isSelected ? styles.selected : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: depth * 16,
        cursor: 'pointer',
        minWidth: 'max-content',
      }}
      onClick={onClick}
    >
      <FileIcon isLoading={!!isLoading} name={icon} extension={file.path.split('.').pop() || ''} />
      <span style={{ marginLeft: 1 }}>{name}</span>
    </div>
  );
};

const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
  pkgName,
  spec,
}: {
  directory: Directory; // 当前目录
  selectedFile: File | undefined; // 选中的文件
  onSelect: (file: File) => void; // 点击事件
  pkgName: string;
  spec: string;
}) => {
  let defaultOpen = selectedFile?.path.includes(directory.path);
  const [open, setOpen] = useState(defaultOpen);
  const { data: res, isLoading } = useDirs({ fullname: pkgName, spec }, directory.path, !open);
  return (
    <>
      <FileDiv
        file={directory}
        icon={open ? 'openDirectory' : 'closedDirectory'}
        selectedFile={selectedFile}
        isLoading={isLoading}
        onClick={() => setOpen(!open)}
      />
      {open ? (
        <SubTree
          directory={res || directory}
          selectedFile={selectedFile}
          onSelect={onSelect}
          pkgName={pkgName}
          spec={spec}
        />
      ) : null}
    </>
  );
};

const FileIcon = ({ extension, name, isLoading }: { name?: string; extension?: string, isLoading: boolean }) => {
  return (
    <span
      style={{
        display: 'flex',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isLoading ? <LoadingOutlined /> : getIcon(extension, name)}
    </span>
  );
};
