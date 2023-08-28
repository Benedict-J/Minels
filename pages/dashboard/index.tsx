import MainLayout from "@/components/layout/MainLayout";

import styles from "./index.module.scss";
import { Card } from "antd";

export default function Dashboard() {
  return(
    <div className={styles.container}>
      <h4>Hi, Ivan!</h4>
      <h3>Overview</h3>
      <div className={styles.summary_row}>
        <Card className={styles.card_statistics} bodyStyle={{ padding: 10 }} size="small">
          <div className={styles.statistic_title}>Total Revenue</div>
          <span className={styles.statistic_amount}>$8,240,000</span>
        </Card>
        <Card className={styles.card_statistics} bodyStyle={{ padding: 10 }} size="small">
          <div className={styles.statistic_title}>Total Items Sold</div>
          <span className={styles.statistic_amount}>80</span>
        </Card>
        <Card className={styles.card_statistics} bodyStyle={{ padding: 10 }} size="small">
          <div className={styles.statistic_title}>Total Revenue</div>
          <span className={styles.statistic_amount}>$8,240,000</span>
        </Card>
      </div>
    </div>
  )
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}