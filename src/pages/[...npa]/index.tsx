import { Result, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import npa from 'npm-package-arg';
import { useMemo } from "react";

export default function Redirect() {
  const router = useRouter();
  const { npa: originNpa } = router.query;

  const redirectInfo = useMemo(() => {
    if (!originNpa) {
      return null;;
    }

    try {
      const info = Array.isArray(originNpa) ? originNpa.join('/') : originNpa;
      const { name, fetchSpec } = npa(info as string);
      return {
        name,
        fetchSpec,
      };
    } catch (e) {
      return null;
    }
  }, [originNpa]);

  if (originNpa?.[0]?.startsWith('~')) {
    router.replace(`/user/${originNpa[0].slice(1)}`);
    return <></>;
  }

  if (redirectInfo) {
    router.replace(`/package/${redirectInfo.name}?version=${redirectInfo.fetchSpec}`);
    return <></>;
  }

  if (redirectInfo === null) {
    return (
      <Result
        title={'解析失败'}
        status={'error'}
        subTitle={
          <>
            {originNpa} 似乎不是一个有效的
            <Link href={`/package/npm-package-arg`} prefetch={false}>
              npa
            </Link>
            参数
          </>
        }
      />
    );
  }

  return <Spin
  style={{
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  }}
/>
}
