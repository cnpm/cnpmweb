import GravatarLink from '@gravatar/js';
import { Avatar, Tooltip } from 'antd';

type GAvatarProps = {
  email: string;
  name: string;
}
export function Gravatar({ email, name }: GAvatarProps) {
  const avatarLink = GravatarLink({
    email: email || '',
    size: 200,
    defaultImage: 'retro',
    protocol: 'https',
  });

  // 转到 cravatar.cn 源
  const newLink = new URL(avatarLink);
  newLink.host = 'cravatar.cn';

  return (
    <Tooltip title={name}>
      <Avatar src={newLink.toString()} />
    </Tooltip>
  );
}
