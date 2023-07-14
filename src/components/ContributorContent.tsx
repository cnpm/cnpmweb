import { Gravatar } from './Gravatar';
import {
  Col,
  Row,
  Tooltip,
} from 'antd';

import React from 'react';
import style from './ContributorContent.module.css';

type ContributorContentProps = {
  members: {name: string; email: string}[];
};

export function ContributorContent({
  members
}: ContributorContentProps) {
  return (
    <Row gutter={[16, 16]}>
      <>
        {members.map((item) => {
          const { email, name } = item;
          return (
            <Col key={item.name}>
              <Gravatar email={email} name={name} />
            </Col>
          );
        })}
      </>
    </Row>
  );
}
