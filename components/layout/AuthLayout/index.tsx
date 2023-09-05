import styles from "./index.module.scss";

export default function AuthLayout({
  children
}: { children: React.ReactNode }) {
  return (
    <div className={styles.home_container}>
      {/* {contextHolder} */}
      <div className={styles.cover_background}>
        <h1>Minels</h1>
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
      <div className={styles.auth_container}>
        {children}
      </div>
    </div>
  )
}