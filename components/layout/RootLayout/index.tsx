import { AuthContext } from "@/context/auth";
import { Button } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import styles from './index.module.scss';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  const redirectToHome = () => router.replace('/')

  if (!currentUser && router.pathname !== "/") {
    return (
      <div className={styles.unauthorized_container}>
        <h1>No Authorization found</h1>
        <h3>To access it please login first</h3>
        <Button type="primary" onClick={redirectToHome}>Return home</Button>
      </div>
    )
  }

  return children;
}