import { Layout as AntdLayout, FloatButton, theme } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export const Layout: React.FC<any> = ({
  children,
}) => {
  const { token } = theme.useToken();

  return (
    <div className="flex! flex-col min-h-dvh">
      <Nav />

      <AntdLayout.Content 
        className="w-full"
        style={{
          backgroundColor: token.colorBgElevated,
        }}
      >
        {children}
      </AntdLayout.Content>

      <Footer />

      <FloatButton.BackTop
        type="primary"
        visibilityHeight={75}
        icon={<ArrowUpOutlined />} // @ts-ignore
        tabIndex={-1}
        style={{ marginBottom: -37 }}
        title="Back to top"
      />
    </div>
  );
}
