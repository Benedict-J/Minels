import MainLayout from "@/components/layout/MainLayout"
import { Button, Col, Form, Input, Row, message } from "antd";

import InTable, { DataTableRef } from "@/components/common/InTable";

import styles from "./index.module.scss";
import { createProduct, deleteProduct, getProduct, loadProducts } from "@/firebase/init-firebase";
import { useRef, useState } from "react";
import ModalForm from "@/components/products/common/ModalForm";

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
      width: 200,
      responsive: ['md']
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      responsive: ['md']
    },
    {
      title: "Action",
      width: 200,
      render: (text: any) => (
        <>
          <Button 
            type="link" 
            onClick={(e) => {
              setId(text.id);
              setOpen(true);
            }}
          >
            Update
          </Button>
          <Button 
            danger 
            onClick={(e) => handleDelete(e, text.id)}
          >
            Delete
          </Button>
        </>
      ),
      responsize: ['md']
    }
  ]

  return(
    <div className={styles.container}>
      {contextHandler}
      <h2>Products</h2>
      <Row className={styles.header} gutter={[8, 8]}>
        <Col xs={24} md={19}>
          <Search 
            className={styles.search}
            placeholder="Search Products" 
            onSearch={handleSearch} 
          />
        </Col>
        <Col xs={24} md={5} className={styles.button_container}>
          <ModalForm 
            id={id} 
            open={open} 
            fullWidth
            onClose={() => setOpen(false)}
            onFinish={() => {
              if (id) {
                messageApi.success("Product has been successfully updated");
              } else {
                messageApi.success("Product has been successfully created");
              }

              tableRef.current?.reload();
            }} 
          />
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
