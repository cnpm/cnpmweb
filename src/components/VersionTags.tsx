import { Popover, Space, Tag, Tooltip } from 'antd';

type VersionTagsProps = {
  tags?: string[];
  style?: React.CSSProperties;
  max?: number;
};

type VersionTagProps = {
  tag: string;
};

function VersionTag({tag}: VersionTagProps) {
if (tag === 'latest') {
  return (
    <Tooltip title='默认匹配的版本' key={tag}>
      <Tag color={'green'}>{tag}</Tag>
    </Tooltip>
  );
}
if (/latest-\d/.test(tag)) {
  const version = tag.split('-')[1];
  return (
    <Tooltip
      key={tag}
      title={`对于 ${version}.x.x 的版本，优先返回该版本`}
    >
      <Tag color={'green'}>{tag}</Tag>
    </Tooltip>
  );
}
return (
  <Tag key={tag} color='lime'>
    {tag}
  </Tag>
);
}

export default function VersionTags({ tags, style, max }: VersionTagsProps) {
  if (!tags) {
    return <></>;
  }

  if (tags.length === 1) {
    return <VersionTag tag={tags[0]} />;
  }

  return (
    <div>
      {tags.slice(0, max).map((tag) => (
        <VersionTag key={tag} tag={tag} />
      ))}
      <Popover
        placement='bottom'
        content={
          <Space size={'small'} direction='vertical'>
            {tags.slice(max, tags.length - 1).map((item) => {
              return (
                <Tag key={item} color='lime'>
                  {item}
                </Tag>
              );
            })}
          </Space>
        }
      >
        <Tag color={'lime'}>...</Tag>
      </Popover>
    </div>
  );
}
