import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import items from "./config/items";

const { Header, Content, Sider } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode } ) {
  const router = useRouter();

  const handleMenuItemClick = ({ item }: { item: any }) => {
    router.push(item.props.path);
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            mode="inline"
            onClick={handleMenuItemClick}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}