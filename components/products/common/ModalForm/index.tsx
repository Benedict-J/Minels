import { formatAmountCurrency } from "@/utils/format"
import { Button, Form, Input, InputNumber } from "antd"

import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import InModal from "@/components/InModal";
import { createProduct, getProduct } from "@/firebase/init-firebase";

export default function ModalForm({
  id,
  open,
  onClose,
  onFinish
}: any) {
  const hasId = id !== null;
  const [form] = Form.useForm();
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    open && handleOpen()
  }, [open])

  const handleFinish = (values: any) => {
    setLoadingForm(true);
    createProduct(values);
    onFinish();
    setLoadingForm(false);
    handleClose();
  }

  const handleOpen = (): undefined => { 
    if (id) {
      setLoadingForm(true)
      getProduct(id)
        .then((res) => form.setFieldsValue(res))
        .finally(() => setLoadingForm(false));
    }
  };


  const handleClose = () => {
    form.resetFields();
    onClose();
  }

  return (
    <InModal
      title="Add Product"
      open={open}
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
          rules={[{ min: 0, type: "number", message: "Quantity must be more than or equal to 0" }]}
        >
          <InputNumber 
            className={styles.input_number}
            controls={false} 
          />
        </Form.Item>
        <Form.Item
          label="Selling Price"
          name="sell_price"
          initialValue={0}
          rules={[{ min: 0, type: "number", message: "Price must be more than or equal to 0" }]}
        >
          <InputNumber
            className={styles.input_number}  
            min={0} 
            controls={false} 
            formatter={formatAmountCurrency} 
          />
        </Form.Item>
        <Form.Item
          label="Purchase Price"
          name="buy_price"
          initialValue={0}
          rules={[{ min: 0, type: "number", message: "Price must be more than or equal to 0" }]}
        >
          <InputNumber 
            className={styles.input_number}
            min={0} 
            controls={false} 
            formatter={formatAmountCurrency} 
            />
        </Form.Item>
        <div className={styles.modal_action}>
          <Button danger size="middle">Cancel</Button>
          <Button type="primary" size="middle" htmlType="submit">Submit</Button>
        </div>
      </Form>
    </InModal>
  )
}