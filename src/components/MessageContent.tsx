import { Button, Empty, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import styles from './index.less';

interface ChangeLogProps {
  changelog: string;
}

export function ChangeLog({ changelog }: ChangeLogProps) {
  return (
    <Typography.Paragraph className={styles.changelog}>
      <div
        dangerouslySetInnerHTML={{
          __html: `${marked(changelog || '[未填写描述]')}`,
        }}
      />
    </Typography.Paragraph>
  );
}

export interface MessageListProps {
  versions: Record<string, Date>;
}

export default function MessageList({ versions }: MessageListProps) {

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* 日志列表 */}
      {versions.length ? (
        <>
          {/* 日志列表 */}
          {versions.slice(0, 6).map((item, index) => {
            const publishDate = moment(item.publish_time);
            const isNew = publishDate.isAfter(moment().add(-14, 'day'));
            const deprecated = item.deprecated;

            return (
              <div className={styles.version} key={index}>
                <Typography.Title level={3} className={styles.title}>
                  <span
                    className={styles.content}
                    style={
                      deprecated
                        ? {
                            color: 'rgba(0,0,0,.25)',
                            textDecoration: 'line-through',
                          }
                        : {}
                    }
                  >
                    {item.version}
                    {isNew && !deprecated ? (
                      <span className={styles.newTag}>New</span>
                    ) : null}
                  </span>
                  <Tooltip title={publishDate.format('YYYY-MM-DD HH:mm:SS')}>
                    <span className={styles.date}>
                      {publishDate.format('YYYY-MM-DD')}
                    </span>
                  </Tooltip>
                </Typography.Title>

                {/* <ChangeLog changelog={item.changelog} /> */}
              </div>
            );
          })}

          {/* 查看全部 */}
          <Button target='_blank' disabled>
            查看全部
          </Button>
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无更新' />
      )}
    </div>
  );
}
