import MainLayout from "@/components/layout/MainLayout"
import { Button, Col, Form, Input, InputNumber, Row } from "antd";

import InTable from "@/components/InTable";

import styles from "./index.module.scss";
import InModal from "@/components/InModal";
import { createProduct, getProduct, loadProducts } from "@/firebase/init-firebase";
import { useState } from "react";

export default function Products() {
  const [form] = Form.useForm();
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleFinish = (values: any) => {
    setLoading(true);
    createProduct(values);
    setId(null);
    setLoading(false);
    setOpen(false);
  }

  const handleOpen = (e?: any, id?: string): void => { 
    if (id) {
      setLoading(true)
      setId(id);

      getProduct(id)
        .then(res => {
          form.setFieldsValue(res);
        })
        .finally(() => setLoading(false));
    }

    setOpen(true);
  };

  const handleClose = () => {
    setId(null);
    setOpen(false);
  }

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
      title: "Action",
      width: 200,
      render: (text: any) => (
        <>
          <Button type="link" onClick={(e) => handleOpen(e, text.id)}>Update</Button>
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
          <InModal 
            title="Add Product" 
            open={open} 
            handleOpen={handleOpen} 
            handleClose={handleClose} 
            loading={loading}
          >
            <Form
              labelCol={{ span: 4 }}
              colon={false}
              onFinish={handleFinish}
              labelAlign="left"
              size="small"
              form={form}
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
                rules={[{ required: true, message: "Name field cannot be empty" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                initialValue={0}
                rules={[{ min: 0, type: 'number', message: "Quantity must be more than or equal to 0" }]}
              >
                <InputNumber min={0} controls={false} className={styles.input_number} readOnly={id !== null} />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                initialValue={0}
                rules={[{ min: 0, type: 'number', message: "Price must be more than or equal to 0" }]}
              >
                <InputNumber min={0} controls={false} className={styles.input_number} />
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
