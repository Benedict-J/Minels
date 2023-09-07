import { Form, Input, Select, Spin } from "antd";

import styles from "./index.module.scss";
import { loadCustomers } from "@/firebase/init-firebase";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export default function SelectCustomer({
  disabled
}: any) {
  const form = Form.useFormInstance();

  const [customers, setCustomers] = useState<any>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [nextPage, setNextPage] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>();
  const [loadBottom, setLoadBottom] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpenSelect = () => handleLoadCustomers([], null);

  const handleLoadCustomers = async (
    currentCustomers: any = [],
    next: any = null,
    search: string = ""
  ) => {
    const result = await loadCustomers(search, 10, next)
    
    setNextPage(result.next);
    setTotalCustomers(result.count);

    const nextCustomers = result.data.map((item: any, index: number) => ({
      value: item.id,
      label: item.name,
      debt: item.debt
    }));

    const newAllCustomers = [...currentCustomers];
    newAllCustomers.push(...nextCustomers);

    setCustomers(newAllCustomers);
    setLoadBottom(false);
  };

  const handleScroll = (e: any) => {
    const target = e.target;

    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight &&
      customers.length < totalCustomers
    ) {
      setLoadBottom(true);
      handleLoadCustomers(customers, nextPage);
    } else {
      setLoadBottom(false);
    }
  };

  const handleCustomerChange = (value: any, option: any) => {
    let currentCustomer = form.getFieldValue("customer");
    
    currentCustomer = {
      id: value,
      name: option.label
    }
    
    form.setFieldValue("customer", currentCustomer);
  }

  const handleSearch = (value: string) => {
    handleLoadCustomers([], null, value);
  }

  return (
    <>
      <Form.Item 
        label="Name" 
        name={["customer", "id"]} 
        dependencies={['status']}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              if ((getFieldValue('status') === 'UNPAID' && value) || getFieldValue('status') === 'PAID') {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Customer must be selected if order is unpaid'))
            }
          })
        ]}
      >
        <Select
          className={styles.name_field_column}
          onDropdownVisibleChange={handleOpenSelect}
          onPopupScroll={handleScroll}
          onChange={handleCustomerChange}
          onSearch={handleSearch}
          options={customers}
          showSearch
          filterOption={false}
          notFoundContent={null}
          disabled={disabled}
          dropdownRender={(originNode) => (
            <>
              <div>{originNode}</div>
              {loadBottom && (
                <div className={styles.spin_container}>
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 16 }}
                        spin
                      />
                    }
                  />
                </div>
              )}
            </>
          )}
        />
      </Form.Item>
      <Form.Item name={["customer", "name"]} noStyle>
        <Input style={{ display: 'none' }} />
      </Form.Item>
    </>
  )
}