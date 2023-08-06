import { Layout, Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import items from "./config/items";

import styles from "./index.module.scss";

const { Header, Content, Sider } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode } ) {
  const router = useRouter();

  const handleMenuItemClick: MenuProps['onClick'] = ({ item }: { item: any }) => {
    router.push(item.props.path);
  }

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
      </Header>
      <Layout>
        <Sider className={styles.sider}>
          <Menu
            mode="inline"
            onClick={handleMenuItemClick}
            items={items}
          />
        </Sider>
        <Layout>
          <Content className={styles.main}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}