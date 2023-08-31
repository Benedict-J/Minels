import { useRouter } from 'next/router';
import { Button, Result } from 'antd';

import styles from './index.module.scss';

export default function Unauthorized() {
  const router = useRouter();
  const redirectToHome = () => router.replace('/')

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={redirectToHome}>Back Home</Button>}
    />
  )
}