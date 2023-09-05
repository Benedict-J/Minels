import AuthLayout from "@/components/layout/AuthLayout"
import styles from "./index.module.scss"
import { Button, Form, Input, message } from "antd"
import Link from "next/link"
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values: any) => {
    try {
      const userCredential = await login(values)

      messageApi.success('You have successfully signed in');
      router.push('/dashboard')
    } catch (e: any) {
      console.log(e.message)

      switch (e.message) {
        case 'Firebase: Error (auth/wrong-password).':
          return message.error('You have entered an invalid username or password');
      }
    }
  }

  return (
    <div className={styles.form_container}>
      {contextHolder}
      <div className={styles.form_title}>
        <h2>Login</h2>
      </div>
      <Form 
        layout="vertical" 
        className={styles.form}
        onFinish={handleFinish}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input type="password" />
        </Form.Item>
        <div className={styles.forgot_password}>
          <Link href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
        <Button 
          className={styles.login_button} 
          type="primary" 
          block
          htmlType="submit"
        >
          Login
        </Button>
      </Form>
      <div className={styles.register_text}>
        Don't have an account? <Link className={styles.link} href="/register">Register now</Link>
      </div>
    </div>
  )
}

Login.getLayout = function getLayout(page: React.ReactNode) {
  return <AuthLayout>{page}</AuthLayout>
}