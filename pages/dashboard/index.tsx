import MainLayout from "@/components/layout/MainLayout";

import styles from "./index.module.scss";
import { Card, List, Statistic } from "antd";
import { useEffect, useState } from "react";
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
import { Doughnut, Line, Pie } from "react-chartjs-2";
import { ArcElement, CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { htmlLegendPlugin } from "@/utils/chart";
import RootLayout from "@/components/layout/RootLayout";
import { endOfFirstWeek, endOfFourthWeek, endOfSecondWeek, endOfThirdWeek } from "@/utils/date";

Chart.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip, 
  Legend
)

interface DashboardData {
  totalRevenue: number;
  totalSales: number;
  popularItems: any[];
  totalProfit: number;
  revenueStatistics: number[];
  salesStatistics: number[];
  highestDebts: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    totalSales: 0,
    popularItems: [],
    totalProfit: 0,
    revenueStatistics: [0, 0],
    salesStatistics: [0, 0, 0, 0],
    highestDebts: []
  });

  const revenueChartData = {
    labels: [
      'Unpaid',
      'Paid'
    ],
    datasets: [
      {
        data: data.revenueStatistics,
        backgroundColor: [
          '#001529',
          '#f0f0f0'
        ],
        weight: 1
      }
    ]
  }
  
  const revenueChartPlugin = {
    plugins: {
      htmlLegend: {
        containerID: 'legend-container'
      },
      legend: {
        display: false,
      }, 
    },
  }

  const salesChartData = {
    labels: [endOfFirstWeek, endOfSecondWeek, endOfThirdWeek, endOfFourthWeek],
    datasets: [
      {
        data: data.salesStatistics,
        borderColor: '#001529',
      }
    ]
  }

  const salesChartOption = {
    responsive: true,      
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20000
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  const fetch = async () => {
    const totalRevenue = await generateTotalRevenue();
    const totalSales = await generateTotalSales();
    const popularItems = await getPopularItems();
    const totalProfit = await generateTotalProfit();
    const revenueStatistics = await generateRevenueStatistics();
    const salesAnalytics = await generateSalesAnalytics();
    const highestDebts = await getHighestDebts();

    setData({
      totalRevenue: totalRevenue,
      totalSales: totalSales,
      popularItems: popularItems,
      totalProfit: totalProfit,
      revenueStatistics: revenueStatistics,
      salesStatistics: salesAnalytics,
      highestDebts: highestDebts
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Overview</h2>
      <div className={styles.summary_row}>
        <Card
          className={styles.card_statistics}
          bodyStyle={{ padding: 10 }}
          size="small"
        >
          <Statistic title="Total Revenue" value={formatAmountCurrency(data.totalRevenue)} valueStyle={{ fontWeight: 700 }} />
        </Card>
        <Card
          className={styles.card_statistics}
          bodyStyle={{ padding: 10 }}
          size="small"
        >
          <Statistic title="Total Items Sold" value={data.totalSales} valueStyle={{ fontWeight: 700 }} />
        </Card>
        <Card
          className={styles.card_statistics}
          // bodyStyle={{ padding: 10 }}
          size="small"
        >
          <Statistic title="Total Profit" value={formatAmountCurrency(data.totalProfit)} valueStyle={{ fontWeight: 700 }} />
        </Card>
      </div>
      <div className={styles.charts_row}>
        <Card
          bodyStyle={{ padding: 10 }}
          size="small"
        >
          <div className={styles.card_title}>Revenue Statistics</div>
          <div className={styles.row_center}>
            <Doughnut 
              className={styles.revenue_chart}
              data={revenueChartData}
              options={revenueChartPlugin}
              plugins={[htmlLegendPlugin]}
            />
            <div id="legend-container"></div>
          </div>
        </Card>
        <Card
          bodyStyle={{ padding: 10 }}
          size="small"
        >
          <div className={styles.card_title}>Sales Analytics</div>
          <Line 
            className={styles.sales_chart}
            data={salesChartData}
            options={salesChartOption}
          />
        </Card>
      </div>
      <div className={styles.list_statistics_row}>
        <List
          size="small"
          header={<div>Best selling items</div>}
          dataSource={data.popularItems}
          renderItem={(item) => (
            <List.Item>
              <div>{item.name}</div>
              <div>{item.sold}</div>
            </List.Item>
          )}
        />
        <List
          size="small"
          header={<div>Highest Debts</div>}
          dataSource={data.highestDebts}
          renderItem={(item) => (
            <List.Item>
              <div>{item.name}</div>
              <div>{formatAmountCurrency(item.debt)}</div>
            </List.Item>
          )}
        />
      </div>
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
