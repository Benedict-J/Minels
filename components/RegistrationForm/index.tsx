import { Button, Form, Input, Typography, message } from 'antd';
import styles from './index.module.scss';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/router';

const { Link } = Typography;

export default function RegistrationForm({
  setIsLogin,
  message
}: any) {
  const router = useRouter();
  const { registerWithEmail } = useContext(AuthContext);

  const handleFinish = async (values: any) => {
    try {
      const userCredential = await registerWithEmail({
        email: values.email, 
        password: values.password
      })

      message.success('You have successfully registered!');
      router.push('/dashboard')
    } catch (e: any) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          return message.error('Email is already in use');
      }
    }
  }

  return (
    <div className={styles.form_container}>
      <div className={styles.form_title}>
        <h2>Registration</h2>
      </div>
      <Form 
        layout="vertical" 
        className={styles.form}
        onFinish={handleFinish}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item 
          label="Confirm Password" 
          name="confirm_password" 
          dependencies={['password']} 
          rules={[
            {  
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              }
            })
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Button 
          className={styles.login_button} 
          type="primary" 
          block
          htmlType="submit"
        >
          Register
        </Button>
      </Form>
      <div className={styles.register_text}>
        Already have an account? <Link onClick={() => setIsLogin(true)}>Login here</Link>
      </div>
    </div>
  )
}