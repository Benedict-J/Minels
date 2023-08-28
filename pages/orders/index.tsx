import { useRef, useState } from "react";
import {  Button, Col, Form, Input, Row, Typography, message } from "antd";

import MainLayout from "@/components/layout/MainLayout"
import InTable, { DataTableRef } from "@/components/InTable";
import InModal from "@/components/InModal";

import styles from "./index.module.scss";
import { createOrder, loadOrders, loadProducts } from "@/firebase/init-firebase";
import ItemOrders from "./components/ItemOrders";

const { Search } = Input;
const { Text } = Typography;

export default function Orders() {
  const [form] = Form.useForm();
  const tableRef = useRef<DataTableRef>(null);
  const [id, setId] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [messageApi, contextHandler] = message.useMessage();
  const [open, setOpen] = useState(false);

  const handleFinish = (values: any) => {
    setLoadingForm(true);
    createOrder(values);

    if (id) {
      messageApi.success("Order has been successfully updated");
    } else {
      messageApi.success("Order has been successfully created");
    }

    setLoadingForm(false);
    handleClose();
    tableRef.current?.reload();
  }

  const handleFinishFailed = ({ errorFields }: { errorFields: any }) => {
    console.log(errorFields)
  }

  const handleOpen = (e?: any, id?: string): void => {
    if (id) {
      setLoadingForm(true)
    }

    setOpen(true);
  }

  const handleClose = () => {
    form.resetFields();
    form.setFieldValue("items", undefined)

    setId(null);
    setOpen(false);
  }

  const handleSearch = (value: string) => {
    tableRef.current?.setFilter((prev: any) => ({ ...prev, search: value }))
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "items",
      dataIndex: "items",
      render: (text: any) => {
        return (
          <Text ellipsis={true}>{text.map((item: any, index: any) => (item.name) + ((text.length - 1) === index ? '' : ', '))}</Text>
        )
      }
    }
  ]

  return(
    <div className={styles.container}>
      <h2>Orders</h2>
      <Row className={styles.header}>
        <Col span={20}>
          <Search placeholder="Search Products" style={{ width: "200px" }} onSearch={handleSearch} />
        </Col>
        <Col span="auto" className={styles.button_container}>
          <InModal 
            title="Add Orders"
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose} 
            loading={false}
          >
            <Form 
              labelCol={{ span: 4 }}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              colon={false}
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
              <ItemOrders formInstance={form} />
              <div className={styles.modal_action}>
                <Button danger size="middle">Cancel</Button>
                <Button type="primary" size="middle" htmlType="submit">Submit</Button>
              </div>
            </Form>
          </InModal>
        </Col>
      </Row>
      <InTable  
        api={loadOrders}
        columns={columns}
        ref={tableRef}
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
