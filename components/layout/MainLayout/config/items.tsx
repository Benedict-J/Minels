import {
  AppstoreOutlined,
  ContainerOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const items: any[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    key: "/dashboard",
    icon: <DashboardOutlined />,
  },
  {
    label: "Orders",
    path: "/orders",
    key: "/orders",
    icon: <ContainerOutlined />,
  },
  {
    label: "Products",
    path: "/products",
    key: "/products",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Customers",
    path: "/customers",
    key: "/customers",
    icon: <TeamOutlined />,
  },
];

export default items;
