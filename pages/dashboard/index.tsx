import MainLayout from "@/components/layout/MainLayout";

import styles from "./index.module.scss";

export default function Dashboard() {
  return(
    <div className={styles.container}>
      This is the dashboard page
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