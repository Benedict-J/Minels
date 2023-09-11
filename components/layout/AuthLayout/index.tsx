import Image from "next/image";
import styles from "./index.module.scss";

export default function AuthLayout({
  children
}: { children: React.ReactNode }) {
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
        <footer className={styles.footer}>
          Copyright © Benedict Jefferson 2023
        </footer>
      </div>
      <div className={styles.auth_container}>
        <Image 
          src="/android-chrome-512x512.png" 
          alt="Logo" 
          width={50}
          height={50} 
        />
        {children}
      </div>
    </div>
  )
}