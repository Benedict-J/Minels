import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";

interface InModalProps {
  title: string,
  open: boolean
  handleOpen: () => void | undefined
  handleClose: () => void | undefined
  children?: React.ReactNode,
}

export default function InModal(props: InModalProps) {
  const {
    title = "",
    open = undefined,
    handleOpen = () => {},
    handleClose = () => {},
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
        {children}
      </Modal>
    </>
  )
}
