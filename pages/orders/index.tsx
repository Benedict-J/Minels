import { useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  message,
} from "antd";

import MainLayout from "@/components/layout/MainLayout";
import InTable, { DataTableRef } from "@/components/InTable";
import InModal from "@/components/InModal";
import ItemOrders from "./components/ItemOrders";
import SelectCustomer from "./components/SelectCustomer";

import styles from "./index.module.scss";
import {
  createOrder,
  getOrder,
  loadOrders,
  updateOrderStatus,
} from "@/firebase/init-firebase";

import { formatAmountCurrency } from "@/utils/format";

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

    try {
      if (id) {
        updateOrderStatus(id, values.status)
        messageApi.success("Order has been successfully updated");
      } else {
        createOrder(values);
        messageApi.success("Order has been successfully created");
      }
      
      setLoadingForm(false);
      handleClose();
      tableRef.current?.reload();
    } catch (e) {
      console.log(e)
    }
  };

  const handleFinishFailed = ({ errorFields }: { errorFields: any }) => {
    console.log(errorFields);
  };

  const handleOpen = (e?: any, id?: string): void => {
    if (id) {
      setLoadingForm(true);
      setId(id);

      getOrder(id)
        .then(res => {
          res = {
            ...res,
            items: res?.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              sell_price: item.sell_price,
              buy_price: item.buy_price
            }))
          }

          console.log(res)

          form.setFieldsValue(res);
        })
        .finally(() => setLoadingForm(false));
    }

    setOpen(true);
  };

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
      width: 200
    },
    {
      title: "Items",
      dataIndex: "items",
      width: 200,
      render: (text: any) => {
        return (
          <Text ellipsis={true}>
            {text.map(
              (item: any, index: any) =>
                item.name + (text.length - 1 === index ? "" : ", "),
            )}
          </Text>
        );
      },
    },
    {
      title: "Action",
      width: 100,
      render: (text: any) => (
        <>
          <Button type="link" onClick={(e) => handleOpen(e, text.id)}>Details</Button>
        </>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <h2>Orders</h2>
      <Row className={styles.header}>
        <Col span={20}>
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
              <Form.Item label="ID" name="id">
                <Input readOnly disabled />
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Select 
                  disabled={id !== null && form.getFieldValue('status') === 'PAID'}
                  options={[ 
                    { value: "UNPAID", label: "Unpaid" },
                    { value: "PAID", label: "Paid" }
                  ]} 
                />
              </Form.Item>
              <SelectCustomer disabled={id !== null} />
              <ItemOrders disabled={id !== null} />
              <div className={styles.order_summary}>
                <Form.Item label="Total Price" name="total">
                  <InputNumber
                    className={styles.summary_details}
                    bordered={false}
                    readOnly
                    formatter={formatAmountCurrency}
                  />
                </Form.Item>
              </div>
              <div className={styles.modal_action}>
                <Button danger size="middle">
                  Cancel
                </Button>
                <Button type="primary" size="middle" htmlType="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </InModal>
        </Col>
      </Row>
      <InTable api={loadOrders} columns={columns} ref={tableRef} />
    </div>
  );
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
