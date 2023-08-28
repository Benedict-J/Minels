import MainLayout from "@/components/layout/MainLayout"
import { Button, Col, Form, Input, InputNumber, Row, message } from "antd";

import InTable, { DataTableRef } from "@/components/InTable";

import styles from "./index.module.scss";
import InModal from "@/components/InModal";
import { createProduct, deleteProduct, getProduct, loadProducts } from "@/firebase/init-firebase";
import { useRef, useState } from "react";

const { Search } = Input;

export default function Products() {
  const [form] = Form.useForm();
  const tableRef = useRef<DataTableRef>(null);
  const [id, setId] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHandler] = message.useMessage();
  
  const handleFinish = (values: any) => {
    setLoadingForm(true);
    createProduct(values);

    if (id) {
      messageApi.success("Product has been successfully updated");
    } else {
      messageApi.success("Product has been successfully created");
    }

    setLoadingForm(false);
    handleClose();
    tableRef.current?.reload();
  }

  const handleOpen = (e?: any, id?: string): void => { 
    if (id) {
      setLoadingForm(true)
      setId(id);

      getProduct(id)
        .then(res => {
          form.setFieldsValue(res);
        })
        .finally(() => setLoadingForm(false));
    }

    setOpen(true);
  };

  const handleClose = () => {
    form.resetFields();
    setId(null);
    setOpen(false);
  }

  const handleDelete = (e: any, id: string) => {
    deleteProduct(id);
    tableRef.current?.reload();
    messageApi.success("Product has been successfully deleted");
  }

  const handleSearch = (value: string) => {
    tableRef.current?.setFilter((prev: any) => ({ ...prev, search: value }))
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
          <Button danger onClick={(e) => handleDelete(e, text.id)}>Delete</Button>
        </>
      )
    }
  ]

  return(
    <div className={styles.container}>
      {contextHandler}
      <h2>Products</h2>
      <Row className={styles.header}>
        <Col span={19}>
          <Search placeholder="Search Products" style={{ width: "200px" }} onSearch={handleSearch} />
        </Col>
        <Col span="5" className={styles.button_container}>
          <InModal 
            title="Add Product" 
            open={open} 
            handleOpen={handleOpen} 
            handleClose={handleClose} 
            loading={loadingForm}
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
        ref={tableRef}
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
