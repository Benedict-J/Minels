import Image from "next/image";
import { Inter } from "next/font/google";

import styles from "./index.module.scss";
import { Button, Form, Input } from "antd";
import RootLayout from "@/components/layout/RootLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
        <Form layout="vertical" className={styles.form}>
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input />
          </Form.Item>
          <Button className={styles.login_button} type="primary" block>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>
} 