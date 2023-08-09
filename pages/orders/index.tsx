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
    title: "Total",
    dataIndex: "total",
    key: "total"
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "customer",
    dataIndex: "customer",
    key: "customer"
  }
]

export default function Orders() {
  return(
    <div className={styles.container}>
      <Row className={styles.header}>
        <Col span={20}>
          <h2>Orders</h2>
        </Col>
        <Col span={4} className={styles.button_container}>
          <Button>
            <PlusOutlined /> Add Order
          </Button>
        </Col>
      </Row>
      <InTable  
        columns={columns}
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
