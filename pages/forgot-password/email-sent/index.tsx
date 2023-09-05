import { Button, Result } from "antd";
import styles from './index.module.scss'

export default function EmailSent() {
  const redirectToLogin = () => {
    window.location.href = '/'
  }

  return (
    <div className={styles.container}>
      <Result 
        title="Link to reset password has been sent to your email"
        extra={
          <Button type="primary" onClick={redirectToLogin}>
            Back to login page
          </Button>
        }
      />
    </div>
  )
}