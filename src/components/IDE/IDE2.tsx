import { Directory } from "@/hooks/useFile";



export const IDE2 = ({
  pkgName,
  spec,
  rootDir,
}: {
  rootDir: Directory;
  pkgName: string;
  spec?: string;
}) => {

  console.log('IDE2 Component');

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
      IDE2 Component
    </div>
  );
};