import AuthLayout from "@/components/layout/AuthLayout"
import styles from "./index.module.scss"
import { Button, Form, Input } from "antd"
import { useContext } from "react"
import { AuthContext } from "@/context/auth"
import { useRouter } from "next/router"
import Link from "next/link"

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword } = useContext(AuthContext);

  const handleFinish = (values: any) => {
    forgotPassword(values.email)
    router.push('/forgot-password/email-sent')
  }

  return (
    <div className={styles.form_container}>
      <div className={styles.form_title}>
        <h2>Forgot Password</h2>
      </div>
      <Form
        layout="vertical"
        className={styles.form}
        onFinish={handleFinish}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button className={styles.button} type="primary" htmlType="submit">
          Reset password
        </Button>
      </Form>
      <Link href="/login" style={{ textDecoration: 'none' }}>
        Back to login
      </Link>
    </div>
  )
}

ForgotPassword.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  )
}