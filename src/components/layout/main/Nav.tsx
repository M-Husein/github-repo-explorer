import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { Layout, Space, Switch, Col, theme } from "antd";
import { Link } from 'react-router';
import { useMode } from "@/contexts/color-mode";

export const Nav: React.FC<RefineThemedLayoutV2HeaderProps> = () => {
  const { token } = theme.useToken();
  const { mode, setMode } = useMode();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    padding: '0 24px',
    height: 56,
  };

  return (
    <Layout.Header 
      style={headerStyles} 
      className={(mode === 'dark' ? '' : 'bg-blue-100! ') + "flex! items-center shadow sticky top-0 z-1035"}
    >
      <Col 
        lg={16} 
        xs={24} 
        className="flex! items-center justify-between mx-auto"
      >
        <Link to="/">
          <img 
            alt={import.meta.env.VITE_APP_NAME} 
            src="/media/img/logo-60x60.png"
            className="h-9 rounded"
          />
        </Link>
        
        <Space>
          <Switch
            checkedChildren="🌛"
            unCheckedChildren="🔆"
            onChange={() => setMode(mode === "dark" ? "light" : "dark")}
            defaultChecked={mode === "dark"}
          />
        </Space>
      </Col>
    </Layout.Header>
  );
}
