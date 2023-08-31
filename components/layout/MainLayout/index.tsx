import { Button, Dropdown, Layout, Menu} from "antd";
import type { MenuProps } from 'antd';
import { useRouter } from "next/router";
import items from "./config/items";

import styles from "./index.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";

const { Header, Content, Sider } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState<string[]>();

  const handleMenuItemClick: MenuProps["onClick"] = ({
    item,
  }: {
    item: any;
  }) => {
    setSelectedMenu(item.props.key);
    router.push(item.props.path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  const navbarItems: MenuProps['items']= [
    {
      key: '1',
      label: (
        <Button onClick={handleLogout}>
          Logout
        </Button>
      )
    }
  ]

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Dropdown menu={{ items: navbarItems }}>
          <Button>Click Here</Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider className={styles.sider} breakpoint="lg" collapsedWidth="0">
          <Menu
            mode="inline"
            onClick={handleMenuItemClick}
            items={items}
            selectedKeys={[router.pathname]}
          />
        </Sider>
        <Layout>
          <Content className={styles.main}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
