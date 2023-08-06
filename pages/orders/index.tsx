import MainLayout from "@/components/layout/MainLayout"
import { Button, Col, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import InTable from "@/components/InTable";

import styles from "./index.module.scss";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
]

export default function Orders() {
  return(
    <div className={styles.container}>
      <Row className={styles.header}>
        <Col span={22}>
          <h2>Orders</h2>
        </Col>
        <Col span={2} className={styles.button_container}>
          <Button>
            <PlusOutlined /> Add Order
          </Button>
        </Col>
      </Row>
      <InTable  
        
      />
    </div>
  )
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}