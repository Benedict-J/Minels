import MainLayout from "@/components/layout/MainLayout/MainLayout"

export default function Dashboard() {
  return(
    <div>
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