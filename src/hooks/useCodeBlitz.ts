import { useEffect, useState, createContext } from 'react';

const LOCAL_STORAGE_IDE_MODE = 'ideMode';


export enum IDEModeName {
  IDE = 'ide',
  NATIVE = 'native'
}

export function useIDE(): [IDEModeName, (v: IDEModeName)=> void] {
  const [IDEMode, setIDEMode] = useState<IDEModeName>(IDEModeName.IDE);
  useEffect(() => {
    const ideMode = localStorage.getItem(LOCAL_STORAGE_IDE_MODE) as IDEModeName;
    if (ideMode) {
      setIDEMode(ideMode);
    }
  }, []);

  return [
    IDEMode,
    (v: IDEModeName) => {
      localStorage.setItem(LOCAL_STORAGE_IDE_MODE, v);
      setIDEMode(v);
    },
  ];
}


export const IDEModeContext = createContext(IDEModeName.IDE);
