import { Button, Form, Input, InputNumber, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { loadProducts } from "@/firebase/init-firebase";

import styles from "./index.module.scss";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function ItemOrders(props: any) {
  const form = Form.useFormInstance();

  const [products, setProducts] = useState<any>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextPageProduct, setNextPageProduct] = useState<QueryDocumentSnapshot<
    DocumentData,
    DocumentData
  > | null>();
  const [loadBottom, setLoadBottom] = useState(false);

  const isItemChosen = (index: any) => {
    if (form.getFieldValue("items")[index]) {
      return form.getFieldValue("items")[index].id.length > 0;
    }

    return false;
  };

  const handleAddItem = (add: any) => {
    const itemsData: any = form.getFieldValue("items");

    if (
      itemsData === undefined ||
      itemsData.length === 0 ||
      (itemsData.length > 0 && itemsData[itemsData.length - 1].id.length !== 0)
    ) {
      add();
    }
  };

  const handleOpenSelect = () => {
    handleLoadProducts([], null);
  };

  const handleLoadProducts = async (
    currentProducts: any = [],
    next: any = null,
  ) => {
    const result = await loadProducts("", 10, next);
    setNextPageProduct(result.next);
    setTotalProducts(result.count);

    const selectedIDs = form.getFieldValue("items").map((item: any) => item.id);

    const nextProducts = result.data.map((item: any, index: number) => ({
      value: item.id,
      label: item.name,
      buy_price: item.buy_price,
      sell_price: item.sell_price,
      disabled: selectedIDs.includes(item.id),
    }));

    const newAllProducts = [...currentProducts];
    newAllProducts.push(...nextProducts);
    setProducts(newAllProducts);
    setLoadBottom(false);
  };

  const handleScroll = (e: any) => {
    const target = e.target;

    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight &&
      products.length < totalProducts
    ) {
      setLoadBottom(true);
      handleLoadProducts(products, nextPageProduct);
    } else {
      setLoadBottom(false);
    }
  };

  const handleItemChange = (value: any, option: any) => {
    let currentItems = form.getFieldValue("items");
    let itemIndex = currentItems.findIndex((item: any) => item.id === value);

    currentItems[itemIndex] = {
      ...currentItems[itemIndex],
      name: option.label,
    };

    form.setFieldValue("items", currentItems);
  };

  const handleQuantityChange = (value: any, index: any) => {
    if (!value) return;

    let currentItems = form.getFieldValue("items");
    let productIndex = products.findIndex(
      (product: any) => product.value === currentItems[index].id,
    );

    currentItems[index] = {
      ...currentItems[index],
      buy_price: products[productIndex].buy_price,
      sell_price: products[productIndex].sell_price * value,
    };

    form.setFieldValue("items", currentItems);

    const total = form
      .getFieldValue("items")
      .reduce((total: number, item: any) => total + item.sell_price, 0);

    form.setFieldValue("total", total);
  };

  return (
    <Form.List 
      name="items" 
      rules={[
        { 
          validator: async (_, items) => {
            if (!items || items.length === 0) {
              return Promise.reject(new Error('At least 1 item selected'))
            }
          }
        }
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th className={styles.quantity_column}>Qty</th>
                <th className={styles.quantity_column}>Price</th>
                <th className={styles.action_column}>Action</th>
              </tr>
            </thead>
            <tbody id="item-orders-tbody">
              {fields.map(({ key, name, ...restField }, index) => (
                <tr key={index} className={styles.table_row}>
                  <td className={styles.name_column}>
                    <Form.Item
                      {...restField}
                      name={[name, "id"]}
                      initialValue=""
                    >
                      <Select
                        className={styles.name_field_column}
                        onDropdownVisibleChange={handleOpenSelect}
                        onPopupScroll={handleScroll}
                        onChange={handleItemChange}
                        options={products}
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
                    <Form.Item {...restField} name={[name, "name"]} noStyle>
                      <Input style={{ display: "none" }} />
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      initialValue={0}
                      hasFeedback={true}
                      rules={[
                        { type: "number", required: true, min: 1, message: "" },
                      ]}
                    >
                      <InputNumber
                        bordered={false}
                        min={0}
                        onChange={(value) => handleQuantityChange(value, index)}
                        disabled={!isItemChosen(index)}
                        controls={false}
                      />
                    </Form.Item>
                  </td>
                  <td>
                    <Form.Item {...restField} name={[name, "buy_price"]} noStyle hidden>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "sell_price"]}
                      initialValue={0}
                    >
                      <Input
                        bordered={false}
                        readOnly
                        min={0}
                        value={
                          form.getFieldsValue(true).items[index]
                            ? form.getFieldsValue(true).items[index].quantity
                            : 0
                        }
                      />
                    </Form.Item>
                  </td>
                  <td className={styles.action_column_item}>
                    <Button type="text" danger onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            onClick={() => handleAddItem(add)}
            className={styles.add_button}
            type="primary"
            block
          >
            Add Item
          </Button>
          <Form.ErrorList className={styles.error_list} errors={errors} />
        </>
      )}
    </Form.List>
  );
}
