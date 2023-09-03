import { SearchPackageResult } from "@/hooks/useSearch";
import { Card, Col, Row, Space, Tag, Tooltip } from "antd";
import Link from "next/link";
import styles from './PackageCard.module.css';
import SkeletonText from "./SkeletonText";
import { Gravatar } from "./Gravatar";
import dayjs from 'dayjs';
import Overflow from 'rc-overflow';
import PackageAvatar from "./PackageAvatar";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

dayjs.extend(relativeTime);

export function PackageTag({ tags }: { tags: string[] }) {
  if (!tags) {
    return null;
  }
  return (
    <Overflow
      style={{ display: 'flex', flexWrap: 'wrap' }}
      className={styles.tagCon}
      maxCount="responsive"
      data={tags}
      renderItem={(tag: string) => <Tag key={tag} color="cyan">{tag}</Tag>}
      renderRest={() => <Tag key={'_others'}>...</Tag>}
    />
  );
}

export const PackageCard = ({
  package: pkg,
  loading = false,
}: {
  package: SearchPackageResult;
  loading?: boolean;
}) => {

  return (
    <Link href={`/package/${pkg.name}`} target='_blank'>
      <Card
        hoverable
        className={styles.packageCard}
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <div
          className={styles.packageCon}
          style={{ paddingLeft: 80, paddingBottom: 16 }}
        >
          {/* Logo */}
          <div className={styles.logo} style={{ top: 20 }}>
            <PackageAvatar size={40} package={pkg} loading={loading} />
          </div>

          {/* 内容 */}
          <div className={styles.content}>
            <Row style={{ flexWrap: 'nowrap' }}>
              <Col flex='auto' style={{ minWidth: 0 }}>
                <SkeletonText
                  className={styles.title}
                  loading={loading}
                  title={pkg.name}
                  ellipsis
                >
                  {pkg.name}@{pkg.version}
                </SkeletonText>
              </Col>
            </Row>

            {/* 描述 */}
            <div className={styles.descriptionCon}>
              <div style={loading ? {} : { marginBottom: '1em' }}>
                <SkeletonText
                  loading={loading}
                  width={500}
                  style={{
                    lineHeight: '22px',
                    marginTop: 16,
                    opacity: '.65',
                    visibility:
                      pkg.description || loading ? 'visible' : 'hidden',
                  }}
                  ellipsis={{ tooltip: true }}
                >
                  {pkg.description || '-'.repeat(50)}
                </SkeletonText>
              </div>
            </div>

            {/* 额外信息 */}
            <div
              style={{
                marginTop: loading ? 20 : 'auto',
                visibility: loading ? 'hidden' : 'visible',
              }}
            >
              <Row gutter={8} align='middle' wrap={false}>
                <Col flex='auto'>
                  <PackageTag tags={pkg.keywords || []} />
                </Col>
                <Col flex='none'>
                  <Space size='small' style={{ opacity: '.65' }}>
                    {pkg._npmUser && (
                      <>
                        由
                        <Tooltip title={pkg._npmUser.name}>
                          <Gravatar
                            email={pkg._npmUser.email}
                            name={pkg._npmUser.name}
                          />
                        </Tooltip>
                        发布于
                      </>
                    )}
                    {pkg.modified && (
                      <span>
                        <Tooltip
                          title={`
                          ${dayjs(pkg.modified).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )}`}
                        >
                          {dayjs(pkg.modified).from(dayjs())}
                        </Tooltip>
                      </span>
                    )}
                  </Space>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
