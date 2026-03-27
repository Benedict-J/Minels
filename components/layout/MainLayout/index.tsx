import { Button, Dropdown, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import items from "./config/items";

import styles from "./index.module.scss";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleMenuItemClick: MenuProps["onClick"] = ({
    item,
  }: {
    item: any;
  }) => {
    router.push(item.props.path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    }
  };

  const navbarItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button className={styles.logoutAction} onClick={handleLogout} type="button">
          <LogoutOutlined />
          <span>Logout</span>
        </button>
      ),
    },
  ];

  return (
    <Layout className={styles.shell}>
      <Header className={styles.header}>
        <div className={styles.headerBrand}>
          <div className={styles.headerLogoWrap}>
            <Image
              src="/minels-logo-white.svg"
              alt="Logo"
              width={28}
              height={28}
            />
          </div>
          <div>
            <strong>Minels</strong>
            <span>Inventory system</span>
          </div>
        </div>

        <Dropdown menu={{ items: navbarItems }} trigger={["click"]}>
          <Button className={styles.accountButton} shape="circle">
            <UserOutlined />
          </Button>
        </Dropdown>
      </Header>

      <Layout className={styles.body}>
        <Sider
          className={styles.sider}
          breakpoint="lg"
          collapsedWidth="0"
          width={280}
        >
          <div className={styles.siderInner}>
            <div className={styles.siderIntro}>
              <p className={styles.siderLabel}>Workspace</p>
              <h2>Navigate the operation</h2>
            </div>

            <Menu
              mode="inline"
              onClick={handleMenuItemClick}
              items={items}
              selectedKeys={[router.pathname]}
              className={styles.menu}
            />

            <div className={styles.siderNote}>
              <MenuFoldOutlined />
              <span>Use the dashboard to monitor sales, stock, and customer activity.</span>
            </div>
          </div>
        </Sider>

        <Layout>
          <Content className={styles.main}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
