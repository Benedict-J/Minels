import MainLayout from "@/components/layout/MainLayout/MainLayout"

export default function Orders() {
  return(
    <div>
      This is the orders page
    </div>
  )
}

Orders.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  )
}