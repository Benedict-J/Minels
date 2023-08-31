import { Button, Form, Input, Typography, message } from 'antd';
import styles from './index.module.scss';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/router';

const { Link } = Typography;

export default function LoginForm({
  setIsLogin,
  message
}: any) {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleFinish = async (values: any) => {
    try {
      const userCredential = await login(values)

      message.success('You have successfully signed in');
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
        Don't have an account? <Link onClick={() => setIsLogin(false)}>Register now</Link>
      </div>
    </div>
  )
}