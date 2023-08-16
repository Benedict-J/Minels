import { PlusOutlined,LoadingOutlined } from "@ant-design/icons";
import { Button, Modal, Spin } from "antd";
import { useState } from "react";
import styles from "./index.module.scss";

interface InModalProps {
  title: string
  open: boolean
  handleOpen: () => void | undefined
  handleClose: () => void | undefined
  loading: boolean
  children?: React.ReactNode,
}

export default function InModal(props: InModalProps) {
  const {
    title = "",
    open = undefined,
    handleOpen = () => {},
    handleClose = () => {},
    loading = false,
    children
  } = props;

  return (
    <>
      <Button onClick={handleOpen}>
        <PlusOutlined /> {title}
      </Button>
      <Modal 
        title={title} 
        open={open} 
        onCancel={handleClose}
        bodyStyle={{
          marginTop: 20
        }}
        footer={false}
      >
        <Spin className={styles.spinner} indicator={<LoadingOutlined />} size="large" spinning={loading}>
          {children}
        </Spin>
      </Modal>
    </>
  )
}
