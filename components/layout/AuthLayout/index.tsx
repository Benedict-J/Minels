import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />

      <div className={styles.shell}>
        <div className={styles.brand}>
          <Link href="/" className={styles.homeLink}>
            <Image
              src="/Minels-icon.png"
              alt="Minels logo"
              width={42}
              height={42}
            />
            <span>Minels</span>
          </Link>
          <p>Inventory control without the spreadsheet chaos.</p>
        </div>

        <section className={styles.card}>{children}</section>
      </div>
    </div>
  );
}
