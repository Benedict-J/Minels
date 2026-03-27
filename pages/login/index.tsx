import AuthLayout from "@/components/layout/AuthLayout"
import styles from "./index.module.scss"
import { Button, Form, Input, message } from "antd"
import Link from "next/link"
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [submitError, setSubmitError] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values: any) => {
    try {
      setSubmitError("");
      await login(values)

      messageApi.success('You have successfully signed in');
      router.push('/dashboard')
    } catch (e: any) {
      let errorText = "";

      switch (e?.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorText = 'You have entered an invalid email or password';
          break;
        case 'auth/invalid-email':
          errorText = 'Please enter a valid email address';
          break;
        case 'auth/too-many-requests':
          errorText = 'Too many login attempts. Please try again later';
          break;
        default:
          errorText = e?.message || 'Login failed. Please check Firebase auth setup.';
      }

      setSubmitError(errorText);
      return messageApi.error(errorText);
    }
  }

  return (
    <div className={styles.form_container}>
      {contextHolder}
      <div className={styles.form_title}>
        <h2>Login</h2>
        <p>Welcome back. Sign in to manage products, orders, and customer balances.</p>
        {submitError ? <p className={styles.form_error}>{submitError}</p> : null}
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
          size="large"
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
