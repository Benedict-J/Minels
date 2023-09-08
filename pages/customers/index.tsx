import MainLayout from "@/components/layout/MainLayout";
import styles from "./index.module.scss";
import { Col, Row, Input, Form, message, InputNumber, Button } from "antd";
import InModal from "@/components/InModal";
import { useRef, useState } from "react";
import InTable, { DataTableRef } from "@/components/InTable";
import { createCustomer, deleteCustomer, loadCustomers } from "@/firebase/init-firebase";
import { formatAmountCurrency } from "@/utils/format";

const { Search } = Input;

export default function Customers() {
  const [form] = Form.useForm();
  const tableRef = useRef<DataTableRef>(null);
  const [id, setId] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [messageApi, contextHandler] = message.useMessage();
  const [open, setOpen] = useState(false);

  const handleFinish = (values: any) => {
    setLoadingForm(true);
    createCustomer(values);

    if (id) {
      messageApi.success("Customer has been successfully updated");
    } else {
      messageApi.success("Customer has been successfully created");
    }

    setLoadingForm(false);
    handleClose();
    tableRef.current?.reload();
  };

  const handleOpen = (e?: any, id?: string): void => {
    if (id) {
      setLoadingForm(true);
    }

    setOpen(true);
  };

  const handleDelete = (e: any, id: string) => {
    deleteCustomer(id);
    tableRef.current?.reload();
    messageApi.success("Order has been successfully deleted");
  }

  const handleClose = () => {
    form.resetFields();
    form.setFieldValue("items", undefined);

    setId(null);
    setOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      responsive: ['md']
    },
    {
      title: "Name",
      dataIndex: "name"
    },
    {
      title: "Total debt",
      dataIndex: "debt",
      width: 200,
      render: (text: string) => (
        <div>{formatAmountCurrency(text)}</div>
      )
    },
    {
      title: "Action",
      width: 100,
      render: (text: any) => {
        return <Button danger onClick={(e) => handleDelete(e, text.id)}>Delete</Button>
      }
    }
  ]

  return (
    <div className={styles.container}>
      {contextHandler}
      <h2>Customers</h2>
      <Row className={styles.header}>
        <Col span={20}>
          <Search
            placeholder="Search Customers"
            style={{ width: "200px" }}
            // onSearch={handleSearch}
          />
        </Col>
        <Col span="4" className={styles.button_container}>
          <InModal
            title="Add Customer"
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            loading={false}
          >
            <Form
              labelCol={{ span: 4 }}
              form={form}
              colon={false}
              size="small"
              labelAlign="left"
              onFinish={handleFinish}
            >
              <Form.Item label="ID" name="id">
                <Input readOnly disabled />
              </Form.Item>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name field cannot be empty" }]}>
                <Input /> 
              </Form.Item>
              <Form.Item 
                label="Debt"
                name="debt"
                initialValue={0}
              >
                <InputNumber
                  controls={false}
                  className={styles.input_number}
                  formatter={formatAmountCurrency}
                  min={0}
                />
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
        api={loadCustomers}
        columns={columns}
        ref={tableRef}
      />
    </div>
  )
}

Customers.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
}