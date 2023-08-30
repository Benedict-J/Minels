import { Layout, Menu, MenuProps } from "antd";
import { useRouter } from "next/router";
import items from "./config/items";

import styles from "./index.module.scss";
import { useState } from "react";

const { Header, Content, Sider } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="demo-logo" />
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
