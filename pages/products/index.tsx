import MainLayout from "@/components/layout/MainLayout"
import { Button, Col, Form, Input, InputNumber, Row } from "antd";

import InTable from "@/components/InTable";

import styles from "./index.module.scss";
import InModal from "@/components/InModal";
import { createProduct, loadProducts } from "@/firebase/init-firebase";
import { useState } from "react";

export default function Products() {
  const [open, setOpen] = useState(false);
  
  const handleFinish = (values: any) => {
    createProduct(values);
  }

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "Action",
      width: 200,
      render: () => (
        <>
          <Button type="link" onClick={handleOpen}>Update</Button>
          <Button danger>Delete</Button>
        </>
      )
    }
  ]

  return(
    <div className={styles.container}>
      <Row className={styles.header}>
        <Col span={20}>
          <h2>Products</h2>
        </Col>
        <Col span="auto" className={styles.button_container}>
          <InModal title="Add Product" open={open} handleOpen={handleOpen} handleClose={handleClose}>
            <Form
              labelCol={{ span: 4 }}
              colon={false}
              onFinish={handleFinish}
              labelAlign="left"
              size="small"
            >
              <Form.Item
                label="ID"
                name="id"
              >
                <Input readOnly disabled />
              </Form.Item>
              <Form.Item
                label="Name"
                name="name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
              >
                <InputNumber min={0} controls={false} defaultValue={0} className={styles.input_number} />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
              >
                <InputNumber min={0} controls={false} defaultValue={0} className={styles.input_number} />
              </Form.Item>
              <div className={styles.modal_action}>
                <Button danger size="middle">Cancel</Button>
                <Button type="primary" size="middle" htmlType="submit">Submit</Button>
              </div>
            </Form>
          </InModal>
        </Col>
      </Row>
      <InTable 
        api={loadProducts}
        columns={columns}
      />
    </div>
  )
}

Products.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}
