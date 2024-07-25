'use client';
import React from 'react';
import { Card, Divider, Typography, theme } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const { useToken } = theme;

export default function Introduce() {
  const { token } = useToken();
  return (
    <div>
      <Card style={{ background: token.colorInfoBg }}>
        <Paragraph style={{ paddingLeft: 12, marginBottom: 0 }}>
          <span style={{ fontSize: 18 }}>🍻</span>「NPM
          Mirror」站点前后端应用代码均已开源，欢迎共建。
          <ol style={{ marginTop: 8, marginBottom: 0, listStyle: 'none' }}>
            <li style={{ display: 'inline-block' }}>
              前端应用:{' '}
              <Link href="https://github.com/cnpm/cnpmweb" target="_blank">
                cnpmweb
              </Link>
            </li>
            <li style={{ display: 'inline-block' }}>
              服务端应用:{' '}
              <Link href="https://github.com/cnpm/cnpmcore" target="_blank">
                cnpmcore
              </Link>
            </li>
          </ol>
        </Paragraph>
      </Card>
      <Card style={{ textAlign: 'left', marginTop: '32px' }} title="功能简介">
        <Paragraph>
          <blockquote>
            这是一个完整{' '}
            <Link target={'_blank'} href="https://www.npmjs.com">
              npmjs.com
            </Link>{' '}
            镜像，你可以用此代替官方版本(只读)，我们将尽量与官方服务
            <Text strong>实时同步</Text>。
          </blockquote>
        </Paragraph>
        <Title level={3} style={{ fontSize: 16 }}>
          使用说明
        </Title>
        <Paragraph>
          你可以使用我们定制的
          <Link href="/package/cnpm" style={{ margin: '0 4px' }}>
            cnpm
          </Link>
          命令行工具代替默认的 npm。
          <br />
          cnpm 支持除了写相关操作外的所有命令，例如 install、info、view 等。
          <br />
          <pre>
            <Text
              copyable={{ text: 'npm install -g cnpm --registry=https://registry.npmmirror.com' }}
            >
              $ npm install -g cnpm --registry=https://registry.npmmirror.com
            </Text>
          </pre>
          或者你直接通过添加 npm 参数 alias 一个新命令:
          <pre>
            <Text
              copyable={{
                text: 'alias cnpm="npm --registry=https://registry.npmmirror.com  --cache=$HOME/.npm/.cache/cnpm  --disturl=https://npmmirror.com/mirrors/node  --userconfig=$HOME/.cnpmrc"',
              }}
            >
              alias cnpm=&quot;npm --registry=https://registry.npmmirror.com \
              --cache=$HOME/.npm/.cache/cnpm \ --disturl=https://npmmirror.com/mirrors/node \
              --userconfig=$HOME/.cnpmrc&quot;
            </Text>
          </pre>
          当然，你也可以使用任意你心仪的命令行工具，只要配置 registry 即可
          <pre>
            <Text copyable={{ text: 'npm config set registry https://registry.npmmirror.com' }}>
              $ npm config set registry https://registry.npmmirror.com
            </Text>
          </pre>
        </Paragraph>

        <Title level={3} style={{ fontSize: 16 }}>
          安装模块
        </Title>
        <Paragraph>
          <pre>$ cnpm install [name]</pre>
        </Paragraph>
        <Title level={3} style={{ fontSize: 16 }}>
          同步模块
        </Title>
        <Paragraph>
          <pre>$ cnpm sync cnpmcore</pre>
          当然, 你可以直接通过 web 方式来同步, 界面打开时会自动比对版本信息
          <pre>$ open https://npmmirror.com/sync/cnpmcore</pre>
        </Paragraph>

        <Paragraph>
          <ul>
            <li>
              <Link href="https://registry.npmmirror.com" target="_blank">
                registry 站点
              </Link>
            </li>
            <li>
              <Link href="/">web 站点</Link>
            </li>
            <li>
              <Link href="/mirrors" target="_blank">
                二进制文件镜像
              </Link>
            </li>
          </ul>
        </Paragraph>
        <Divider />
      </Card>
    </div>
  );
}
