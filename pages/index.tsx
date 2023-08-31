import LoginForm from "@/components/LoginForm";
import styles from "./index.module.scss";
import { useState } from "react";
import { message } from "antd";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className={styles.home_container}>
      {contextHolder}
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
      {isLogin? <LoginForm setIsLogin={setIsLogin} message={messageApi} /> : null}
    </div>
  );
}