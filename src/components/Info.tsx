'use client'
import { Typography } from "antd";
import SizeContainer from "./SizeContainer";
import AntdStyle from "./AntdStyle";

export default function Info() {
  return (
    <AntdStyle>
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <SizeContainer maxWidth={1280}>
        <img src="https://render.alipay.com/p/s/taobaonpm_click/npmtaobao_banner" alt='vps-ad'/>
      </SizeContainer>
    </div>
    </AntdStyle>
  );
}
