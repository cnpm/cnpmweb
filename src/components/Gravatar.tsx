import GravatarLink from '@gravatar/js';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';

type GAvatarProps = {
  email: string;
  name: string;
  size?: number;
  link?: boolean;
};
export function Gravatar({ email, name, size = 32, link = true }: GAvatarProps) {
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
      {link ? (
        <Link href={`/user/${name}`} shallow>
          <Avatar src={newLink.toString()} size={size} />
        </Link>
      ) : (
        <Avatar src={newLink.toString()} size={size} />
      )}
    </Tooltip>
  );
}
