import { AuthContext } from "@/context/auth";
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import styles from './index.module.scss';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      router.push('/unauthorized')
    }
  }, [router.push, currentUser])

  return (
    currentUser? children : null
  );
}