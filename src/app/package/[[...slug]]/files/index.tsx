'use client';
import { Result } from "antd";
import Link from "next/link";

export default function Files() {
  return <Result status="404" title="这里将实现产物预览" subTitle={<>效果大概和<Link target="_blank" href="https://uncap.elrrrrrrr.cloud/cnpmcore@3.x">这里</Link>类似</>}></Result>
}
