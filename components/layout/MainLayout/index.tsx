import { Button, Dropdown, Layout, Menu} from "antd";
import type { MenuProps } from 'antd';
import Image from "next/image";
import { useRouter } from "next/router";
import items from "./config/items";

import styles from "./index.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";
import { UserOutlined } from "@ant-design/icons";

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
    } catch (e) {
      console.log(e)
    }
  }

  const navbarItems: MenuProps['items']= [
    {
      key: '1',
      label: (
        <div onClick={handleLogout}>
          Logout
        </div>
      )
    }
  ]

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: 'space-between',
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Image 
          src="/Minels-icon-white.png" 
          alt="Logo" 
          width={30} 
          height={30} 
        />
        <Dropdown menu={{ items: navbarItems }}>
          <Button shape="circle">
            <UserOutlined />
          </Button>
        </Dropdown>
      </Header>
      <Layout>
        <Sider 
          className={styles.sider} 
          breakpoint="lg" 
          collapsedWidth="0"
          width={300}
        >
          <Menu
            mode="inline"
            onClick={handleMenuItemClick}
            items={items}
            selectedKeys={[router.pathname]}
          />
        </Sider>
        <Layout>
          <Content className={styles.main}>{children}</Content>
          <footer className={styles.footer}>
            Copyright © Benedict Jefferson 2023
          </footer>
        </Layout>
      </Layout>
    </Layout>
  );
}
