import { getFileContent, Directory } from '@/hooks/useFile';
import {
  AppRenderer,
  BrowserFSFileType as FileType,
  SlotLocation,
} from '@codeblitzjs/ide-core/bundle/index.min';
import '@codeblitzjs/ide-core/bundle/codeblitz.css';
import '@codeblitzjs/ide-core/languages';
import { useEffect, useMemo, useState } from 'react';
import { useThemeMode } from 'antd-style';
import * as IDEPlugin from './ide.plugin';
import IDEStyle from './ide.module.css';
import { RegisterMenuModule } from './module';

const layoutConfig = () => ({
  // [SlotLocation.top]: {
  //   modules: ['@opensumi/ide-menu-bar'],
  // },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer', '@opensumi/ide-search'],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  // [SlotLocation.bottom]: {
  //   modules: ['@opensumi/ide-output', '@opensumi/ide-markers'],
  // },
  // [SlotLocation.statusBar]: {
  //   modules: ['@opensumi/ide-status-bar'],
  // },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
});

function recursiveFind(path: string, treeNode: Directory): Directory {
  if (treeNode.path === path) {
    return treeNode;
  } else {
    const currentTree = treeNode.files!.find((item) => item.path === path);
    if (currentTree) {
      return currentTree as Directory;
    } else {
      let dir: Directory;
      for (let i = 0; i < treeNode.files.length; i++) {
        const item = treeNode.files[i];
        if (item.type === 'directory') {
          const res = recursiveFind(path, item as Directory);
          if (res?.path) {
            dir = res;
            break;
          }
        }
      }
      return dir!;
    }
  }
}

function recursivePush(rootDir: Directory): string[] {
  const allFiles: string[] = [];
  rootDir.files?.forEach((file) => {
    if (file.type === 'file') {
      let path = file.path;
      if (file.path.startsWith('/')) {
        path = path.slice(1);
      }
      allFiles.push(path);
    } else if (file.type === 'directory') {
      allFiles.push(...recursivePush(file as Directory));
    }
  });
  return allFiles;
}

export const IDE = ({
  pkgName,
  spec,
  rootDir,
}: {
  rootDir: Directory;
  pkgName: string;
  spec?: string;
}) => {
  const { themeMode: theme } = useThemeMode();
  useEffect(() => {
    IDEPlugin.api.commands?.executeCommand(
      'alex.setDefaultPreference',
      'general.theme',
      theme === 'light' ? 'opensumi-light' : 'opensumi-dark',
    );
  }, [theme]);

  const files = useMemo(() => {
    const res = recursivePush(rootDir);
    return res;
  }, [rootDir]);

  return (
    <div className={IDEStyle.ideContainer} style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      <AppRenderer
        appConfig={{
          layoutConfig: layoutConfig(),
          workspaceDir: `${pkgName}-${spec}`,
          defaultPreferences: {
            'general.theme': theme === 'light' ? 'opensumi-light' : 'opensumi-dark',
            'editor.forceReadOnly': true,
          },
          plugins: [IDEPlugin],
          modules: [RegisterMenuModule],
          extWorkerHost:'https://gw.alipayobjects.com/os/ide-server/worker-host.d008d7af.js'
        }}
        runtimeConfig={{
          disableModifyFileTree: true,
          defaultOpenFile: 'package.json',
          startupEditor: 'welcomePage',
          workspace: {
            filesystem: {
              fs: 'DynamicRequest',
              options: {
                async readDirectory(p: string) {
                  const res = recursiveFind(p, rootDir);
                  return (
                    res?.files?.map((file) => [
                      file.path.split('/').pop() as string,
                      file.type === 'directory' ? FileType.DIRECTORY : FileType.FILE,
                    ]) || []
                  );
                },
                async readFile(p) {
                  const res = await getFileContent({ fullname: pkgName, spec }, p || '');
                  return new TextEncoder().encode(res);
                },
              },
            },
          },
          textSearch: {
            config: {
              replace: false,
              wordMatch: 'local',
              include: 'local',
              exclude: 'local',
            },
            provideResults(query, opt, progress) {
              // TODO 全局搜索 只能搜索到已经打开过的文件 依赖服务端能力
              return Promise.resolve();
            },
          },
          fileSearch: {
            config: {
              include: 'local',
              exclude: 'local',
            },
            provideResults() {
              return files;
            },
          },
        }}
      />
    </div>
  );
};
