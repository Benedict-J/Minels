import MainLayout from "@/components/layout/MainLayout";
import RootLayout from "@/components/layout/RootLayout";
import styles from "./index.module.scss";
import { useEffect, useMemo, useState } from "react";
import {
  generateRevenueStatistics,
  generateSalesAnalytics,
  generateTotalProfit,
  generateTotalRevenue,
  generateTotalSales,
  getHighestDebts,
  getPopularItems,
} from "@/firebase/init-firebase";
import { formatAmountCurrency } from "@/utils/format";
import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { endOfFirstWeek, endOfFourthWeek, endOfSecondWeek, endOfThirdWeek } from "@/utils/date";
import {
  ArrowUpOutlined,
  DollarOutlined,
  RiseOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface DashboardData {
  totalRevenue: number;
  totalSales: number;
  popularItems: any[];
  totalProfit: number;
  revenueStatistics: number[];
  salesStatistics: number[];
  highestDebts: any[];
}

const emptyDashboard: DashboardData = {
  totalRevenue: 0,
  totalSales: 0,
  popularItems: [],
  totalProfit: 0,
  revenueStatistics: [0, 0],
  salesStatistics: [0, 0, 0, 0],
  highestDebts: [],
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(emptyDashboard);

  const revenueChartData = useMemo(
    () => ({
      labels: ["Unpaid", "Paid"],
      datasets: [
        {
          data: data.revenueStatistics,
          backgroundColor: ["#07203f", "#d7e3e0"],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    }),
    [data.revenueStatistics]
  );

  const revenueChartOptions = useMemo(
    () => ({
      cutout: "72%",
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    []
  );

  const salesChartData = useMemo(
    () => ({
      labels: [endOfFirstWeek, endOfSecondWeek, endOfThirdWeek, endOfFourthWeek],
      datasets: [
        {
          data: data.salesStatistics,
          borderColor: "#0f766e",
          backgroundColor: "rgba(15, 118, 110, 0.12)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 5,
        },
      ],
    }),
    [data.salesStatistics]
  );

  const salesChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(15, 23, 42, 0.08)",
          },
          ticks: {
            stepSize: 20000,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }),
    []
  );

  const revenueBreakdown = [
    {
      label: "Unpaid",
      value: data.revenueStatistics[0] || 0,
      tone: styles.toneDark,
    },
    {
      label: "Paid",
      value: data.revenueStatistics[1] || 0,
      tone: styles.toneSoft,
    },
  ];

  const fetchDashboard = async () => {
    const totalRevenue = await generateTotalRevenue();
    const totalSales = await generateTotalSales();
    const popularItems = await getPopularItems();
    const totalProfit = await generateTotalProfit();
    const revenueStatistics = await generateRevenueStatistics();
    const salesAnalytics = await generateSalesAnalytics();
    const highestDebts = await getHighestDebts();

    setData({
      totalRevenue,
      totalSales,
      popularItems,
      totalProfit,
      revenueStatistics,
      salesStatistics: salesAnalytics,
      highestDebts,
    });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Dashboard</p>
          <h1>Overview</h1>
          <p className={styles.lead}>A quick read on revenue, sales, and customer risk.</p>
        </div>
        <div className={styles.heroCallout}>
          <span>Monthly focus</span>
          <strong>{formatAmountCurrency(data.totalRevenue)}</strong>
          <p>Revenue tracked across paid and unpaid order flow.</p>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarOutlined />
          </div>
          <div>
            <p>Total Revenue</p>
            <strong>{formatAmountCurrency(data.totalRevenue)}</strong>
          </div>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statIcon}>
            <ShoppingOutlined />
          </div>
          <div>
            <p>Total Items Sold</p>
            <strong>{data.totalSales}</strong>
          </div>
        </article>

        <article className={styles.statCard}>
          <div className={styles.statIcon}>
            <RiseOutlined />
          </div>
          <div>
            <p>Total Profit</p>
            <strong>{formatAmountCurrency(data.totalProfit)}</strong>
          </div>
        </article>
      </section>

      <section className={styles.analyticsGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Revenue Mix</p>
              <h2>Paid vs unpaid revenue</h2>
            </div>
          </div>

          <div className={styles.donutLayout}>
            <div className={styles.donutWrap}>
              <Doughnut data={revenueChartData} options={revenueChartOptions} />
            </div>

            <div className={styles.legendList}>
              {revenueBreakdown.map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <div className={styles.legendTop}>
                    <span className={`${styles.legendDot} ${item.tone}`} />
                    <span>{item.label}</span>
                  </div>
                  <strong>{formatAmountCurrency(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className={`${styles.panel} ${styles.panelWide}`}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Sales Trend</p>
              <h2>Weekly sales analytics</h2>
            </div>
          </div>

          <div className={styles.lineChartWrap}>
            <Line data={salesChartData} options={salesChartOptions} />
          </div>
        </article>
      </section>

      <section className={styles.insightGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Best Sellers</p>
              <h2>Items moving fastest</h2>
            </div>
            <ArrowUpOutlined className={styles.headerIcon} />
          </div>

          <div className={styles.listBlock}>
            {data.popularItems.length ? (
              data.popularItems.map((item) => (
                <div key={item.name} className={styles.listRow}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>Units sold</p>
                  </div>
                  <span>{item.sold}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No item activity yet.</p>
            )}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Customer Risk</p>
              <h2>Highest outstanding debts</h2>
            </div>
            <TeamOutlined className={styles.headerIcon} />
          </div>

          <div className={styles.listBlock}>
            {data.highestDebts.length ? (
              data.highestDebts.map((item) => (
                <div key={item.name} className={styles.listRow}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>Outstanding balance</p>
                  </div>
                  <span>{formatAmountCurrency(item.debt)}</span>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>No customer debt recorded yet.</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return (
    <RootLayout>
      <MainLayout>{page}</MainLayout>
    </RootLayout>
  );
};
