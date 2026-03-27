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
import InTable, { DataTableRef } from "@/components/common/InTable";
import InModal from "@/components/common/InModal";
import ItemOrders from "./components/ItemOrders";
import SelectCustomer from "@/components/orders/common/SelectCustomer";

import styles from "./index.module.scss";
import {
  createOrder,
  getOrder,
  loadOrders,
  updateOrderStatus,
} from "@/firebase/init-firebase";

import { formatAmountCurrency } from "@/utils/format";
import {
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export default function Orders() {
  const [form] = Form.useForm();
  const tableRef = useRef<DataTableRef>(null);
  const [id, setId] = useState<string | null>(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [messageApi, contextHandler] = message.useMessage();
  const [open, setOpen] = useState(false);

  const filterOrders = (changedValues: any) => {
    if (changedValues.customer) {
      tableRef.current?.setFilter((prev: any) => ({
        ...prev,
        customer: changedValues.customer.id,
      }));
    } else if (changedValues.status) {
      tableRef.current?.setFilter((prev: any) => ({
        ...prev,
        status: changedValues.status,
      }));
    }
  };

  const handleFinish = async (values: any) => {
    setLoadingForm(true);

    try {
      if (id) {
        await updateOrderStatus(id, values.status);
        messageApi.success("Order has been successfully updated");
      } else {
        await createOrder(values);
        messageApi.success("Order has been successfully created");
      }

      handleClose();
      tableRef.current?.reload();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleFinishFailed = ({ errorFields }: { errorFields: any }) => {
    console.log(errorFields);
  };

  const handleOpen = (e?: any, nextId?: string): void => {
    if (nextId) {
      setLoadingForm(true);
      setId(nextId);

      getOrder(nextId)
        .then((res) => {
          res = {
            ...res,
            items: res?.items.map((item: any) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              sell_price: item.sell_price,
              buy_price: item.buy_price,
            })),
          };

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
      title: "Order ID",
      dataIndex: "id",
      width: 220,
    },
    {
      title: "Items",
      dataIndex: "items",
      width: 260,
      responsive: ["lg"],
      render: (text: any) => (
        <Text ellipsis>
          {text.map(
            (item: any, index: any) =>
              item.name + (text.length - 1 === index ? "" : ", ")
          )}
        </Text>
      ),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      width: 180,
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (value: string) => (
        <span
          className={
            value === "PAID" ? styles.statusPaid : styles.statusUnpaid
          }
        >
          {value === "PAID" ? "Paid" : "Unpaid"}
        </span>
      ),
    },
    {
      title: "",
      width: 120,
      render: (text: any) => (
        <Button type="link" onClick={(e) => handleOpen(e, text.id)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {contextHandler}

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Orders</p>
          <h1>Manage orders</h1>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarCopy}>
            <p className={styles.sectionLabel}>Order list</p>
          </div>

          <div className={styles.toolbarFilters}>
            <Form onValuesChange={filterOrders} className={styles.filterForm}>
              <SelectCustomer
                label={null}
                noStyle
                className={styles.select}
                placeholder="Filter customer"
              />
              <Form.Item name="status" noStyle>
                <Select
                  className={styles.filterStatus}
                  placeholder="Filter status"
                  options={[
                    { value: "All", label: "All" },
                    { value: "UNPAID", label: "Unpaid" },
                    { value: "PAID", label: "Paid" },
                  ]}
                />
              </Form.Item>
            </Form>

            <InModal
              title={id ? "Order details" : "Add order"}
              open={open}
              handleOpen={handleOpen}
              handleClose={handleClose}
              loading={false}
              buttonText={
                <span className={styles.addOrderButtonText}>
                  <PlusOutlined />
                  <span>New order</span>
                </span>
              }
            >
              <div className={styles.modalIntro}>
                <FileTextOutlined />
                <div>
                  <strong>{id ? "Update order" : "New order"}</strong>
                </div>
              </div>

              <Form
                layout="vertical"
                onFinish={handleFinish}
                onFinishFailed={handleFinishFailed}
                size="middle"
                form={form}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="ID" name="id">
                      <Input readOnly disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Status" name="status">
                      <Select
                        disabled={id !== null && form.getFieldValue("status") === "PAID"}
                        options={[
                          { value: "UNPAID", label: "Unpaid" },
                          { value: "PAID", label: "Paid" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <SelectCustomer disabled={id !== null} />
                <ItemOrders disabled={id !== null} />

                <div className={styles.orderSummary}>
                  <div className={styles.summaryLabel}>Order total</div>
                  <Form.Item label={null} name="total" className={styles.summaryField}>
                    <InputNumber
                      className={styles.summaryDetails}
                      bordered={false}
                      readOnly
                      formatter={formatAmountCurrency}
                    />
                  </Form.Item>
                </div>

                <div className={styles.modalAction}>
                  <Button onClick={handleClose} size="middle">
                    Cancel
                  </Button>
                  <Button type="primary" size="middle" htmlType="submit" loading={loadingForm}>
                    {id ? "Update order" : "Submit order"}
                  </Button>
                </div>
              </Form>
            </InModal>
          </div>
        </div>

        <div className={styles.tableCard}>
          <InTable api={loadOrders} columns={columns} ref={tableRef} />
        </div>
      </section>
    </div>
  );
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout>{page}</MainLayout>;
};
