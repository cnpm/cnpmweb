import GravatarLink from '@gravatar/js';
import { Avatar, Tooltip } from 'antd';

type GAvatarProps = {
  email: string;
  name: string;
  size?: number;
};
export function Gravatar({ email, name, size = 32 }: GAvatarProps) {
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
      <Avatar src={newLink.toString()} size={size} />
    </Tooltip>
  );
}
