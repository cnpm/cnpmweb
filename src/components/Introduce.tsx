'use client';
import React from 'react';
import { Divider, Tooltip, Typography } from 'antd';
import useRegistry from '@/hooks/useRegistry';
const { Title, Paragraph, Text, Link } = Typography;

export default function Introduce() {
  const { data } = useRegistry();
  return (
    <Typography style={{ textAlign: 'left', marginTop: '32px' }}>
      <Title level={2}>站点介绍</Title>
      <Paragraph>
        <blockquote>
          这是一个完整
          <Link target={'_blank'} href='https://www.npmjs.com'>
            npmjs.com
          </Link>{' '}
          镜像，你可以用此代替官方版本(只读)，我们将尽量与官方服务
          <Text strong>实时同步</Text>。
          <br/>
          我们的前后端应用代码均已开源，前端应用为{' '}
          <Link target='_blank' href='https://github.com/cnpm/cnpmweb'>
            cnpmweb
          </Link>
          ，服务端应用为{' '}
          <Link target='_blank' href='https://github.com/cnpm/cnpmcore'>
            cnpmcore
          </Link>{' '}
          欢迎共建。
        </blockquote>
        目前我们已累积同步了 <Text strong>{data?.doc_count || '-'}</Text>{' '}
        个包，近7日下载量为 <Text strong>{data?.download.thisweek || '-'}</Text>
        。
        <Divider />
        <ul>
          <li>
            最近更新的包为
            <Link
              href={`/${data?.sync_changes_steam.last_package}`}
              style={{ marginLeft: 8 }}
              disabled={!data}
            >
              {data?.sync_changes_steam.last_package || '-'}
            </Link>
          </li>
          <li>
            最近同步的时间为
            <Tooltip title={'由于近期功能升级，同步预计与8月26日凌晨恢复'}>
              <Text strong style={{ paddingLeft: 8 }}>
                {data?.sync_changes_steam.last_package_created || '-'}
              </Text>
            </Tooltip>
          </li>
        </ul>
      </Paragraph>

      <Title level={2}>使用说明</Title>
      <Paragraph>
        你可以使用我们定制的 <Link href='/package/cnpm'>cnpm</Link> 命令行工具代替默认的
        npm。
        <br />
        cnpm 支持除了写相关操作外的所有命令，例如 install、info、view 等。
        <br />
        <pre>
          $ npm install -g cnpm --registry=https://registry.npmmirror.com
        </pre>
        或者你直接通过添加 npm 参数 alias 一个新命令:
        <pre>
          alias cnpm=&quot;npm --registry=https://registry.npmmirror.com \
          --cache=$HOME/.npm/.cache/cnpm \
          --disturl=https://npmmirror.com/mirrors/node \
          --userconfig=$HOME/.cnpmrc&quot;
        </pre>
        当然，你也可以使用任意你心仪的命令行工具，只要配置 registry 即可
        <pre>$ npm config set registry https://registry.npmmirror.com</pre>
      </Paragraph>

      <Title level={3}>安装模块</Title>
      <Paragraph>
        <pre>$ cnpm install [name]</pre>
      </Paragraph>
      <Title level={3}>同步模块</Title>
      <Paragraph>
        <pre>$ cnpm sync cnpmcore</pre>
        当然, 你可以直接通过 web 方式来同步, 界面打开时会自动比对版本信息
        <pre>$ open https://npmmirror.com/sync/cnpmcore</pre>
      </Paragraph>

      <Paragraph>
        <ul>
          <li>
            <Link href='https://registry.npmmirror.com' target='_blank'>
              registry 站点
            </Link>
          </li>
          <li>
            <Link href='/'>web 站点</Link>
          </li>
          <li>
            <Link href='/mirrors' target='_blank'>二进制文件镜像</Link>
          </li>
        </ul>
      </Paragraph>
      <Divider />
    </Typography>
  );
}
