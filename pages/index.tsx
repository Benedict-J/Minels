import styles from "./index.module.scss";
import { Button, Form, Input } from "antd";
import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleFinish = async (values: any) => {
    try {
      const userCredential = await login(values)

      router.push('/dashboard')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={styles.home_container}>
      <div className={styles.cover_background}>
        <h1>Minels</h1>
        <p>The minimal solution to your sales management system</p>
        <ul className={styles.features}>
          <li>
            Dashboard for reviewing your business health
          </li>
          <li>
            Track customers debt
          </li>
          <li>
            Track inventory change from purchases
          </li>
        </ul>
      </div>
      <div className={styles.form_container}>
        <div className={styles.form_title}>
          <h2>Login</h2>
        </div>
        <Form 
          layout="vertical" 
          className={styles.form}
          onFinish={handleFinish}
        >
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input />
          </Form.Item>
          <Button 
            className={styles.login_button} 
            type="primary" 
            block
            htmlType="submit"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}