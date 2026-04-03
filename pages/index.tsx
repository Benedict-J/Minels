import Image from "next/image";
import Link from "next/link";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  InboxOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";

const reasons = [
  {
    icon: <BarChartOutlined />,
    title: "Stay ahead of stock issues",
    description: "Track movement clearly so low stock and fast sellers are easy to spot.",
  },
  {
    icon: <CreditCardOutlined />,
    title: "Keep customer balances organized",
    description: "Monitor debts and payments without jumping between spreadsheets.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Operate with more confidence",
    description: "Give your team one place to check the health of daily operations.",
  },
];

const features = [
  {
    icon: <InboxOutlined />,
    title: "Product management",
    description: "Create, update, and monitor inventory records from one dashboard.",
  },
  {
    icon: <ShopOutlined />,
    title: "Customer records",
    description: "Keep customer details and order history close to the transaction flow.",
  },
  {
    icon: <LineChartOutlined />,
    title: "Business snapshot",
    description: "Use charts and summaries to understand movement and performance faster.",
  },
];

const useCases = [
  {
    title: "For store owners",
    description:
      "Get a quick operational overview before checking stock, customer balances, and transactions.",
  },
  {
    title: "For admins",
    description:
      "Keep records updated in one place instead of juggling spreadsheets and scattered notes.",
  },
  {
    title: "For daily operations",
    description:
      "Use a simple flow for managing products, customers, and inventory changes throughout the day.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <header className={styles.topBar}>
        <Link href="/" className={styles.brand}>
          <Image src="/minels-logo.svg" alt="Minels logo" width={132} height={34} priority />
        </Link>

        <nav className={styles.nav}>
          <a href="#why">Why Minels</a>
          <a href="#features">Features</a>
          <a href="#reviews">Use Cases</a>
        </nav>

        <div className={styles.topActions}>
          <Link href="/login" className={styles.navLink}>
            Login
          </Link>
          <Link href="/register" className={styles.navCta}>
            Get started
          </Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Inventory clarity for growing businesses</div>
          <h1>Manage stock, customers, and daily decisions from one calmer homepage.</h1>
          <p className={styles.lead}>
            Minels gives your business a familiar, trustworthy website structure while
            pointing people directly into the product. It explains the value fast, feels
            polished on mobile, and makes the system easier to trust from the first visit.
          </p>

          <div className={styles.heroPoints}>
            <span>
              <CheckCircleOutlined /> Clear inventory tracking
            </span>
            <span>
              <CheckCircleOutlined /> Debt and customer visibility
            </span>
            <span>
              <CheckCircleOutlined /> Fast dashboard access
            </span>
          </div>

          <div className={styles.ctaRow}>
            <Link href="/register" className={styles.primaryCta}>
              Create account
            </Link>
            <Link href="/login" className={styles.secondaryCta}>
              Login
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualFrame}>
            <div className={styles.visualHeader}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.visualCopy}>
              <p>Operational snapshot</p>
              <h2>See what needs attention before the day gets noisy.</h2>
            </div>
            <Image
              src="/images/dashboard_image.png"
              alt="Minels dashboard preview"
              width={1200}
              height={760}
              priority
              className={styles.dashboardImage}
            />
          </div>
        </div>
      </section>

      <section id="why" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Why Minels</p>
          <h2>Built for teams that want more control without adding more operational friction.</h2>
          <p>
            The homepage now follows the standard marketing flow people already expect,
            making it easier to understand the product and move into action.
          </p>
        </div>

        <div className={styles.cardGrid}>
          {reasons.map((reason) => (
            <article key={reason.title} className={styles.infoCard}>
              <span className={styles.cardIcon}>{reason.icon}</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className={styles.sectionAlt}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Feature List</p>
          <h2>Everything important is grouped into clear, familiar product sections.</h2>
          <p>
            Visitors can quickly understand what Minels does before deciding to sign in or
            create an account.
          </p>
        </div>

        <div className={styles.featureList}>
          {features.map((feature, index) => (
            <article key={feature.title} className={styles.featureItem}>
              <div className={styles.featureMeta}>
                <span className={styles.featureNumber}>{`0${index + 1}`}</span>
                <span className={styles.cardIcon}>{feature.icon}</span>
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="reviews" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Who It Helps</p>
          <h2>Use-case cards keep this section honest while still showing where Minels fits.</h2>
          <p>
            This works better than made-up testimonials when you do not yet have real customer
            feedback to show.
          </p>
        </div>

        <div className={styles.reviewGrid}>
          {useCases.map((item) => (
            <article key={item.title} className={styles.reviewCard}>
              <span className={styles.cardIcon}>
                <SolutionOutlined />
              </span>
              <h3>{item.title}</h3>
              <p className={styles.reviewQuote}>{item.description}</p>
              <div className={styles.reviewAuthor}>
                <CheckCircleOutlined />
                <span>Practical fit</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerIntro}>
          <div className={styles.footerBrand}>
            <Image
              src="/Minels-icon-white.png"
              alt="Minels icon"
              width={44}
              height={44}
              className={styles.footerBrandIcon}
            />
            <span>Minels</span>
          </div>
          <h2>Inventory software that feels organized before users even log in.</h2>
          <p>
            Minels gives growing businesses a cleaner way to present the product and guide
            people into stock, customer, and dashboard workflows.
          </p>
          <div className={styles.footerCtas}>
            <Link href="/register" className={styles.footerPrimary}>
              Create account
            </Link>
            <Link href="/login" className={styles.footerSecondary}>
              Login
            </Link>
          </div>
        </div>

        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <span className={styles.footerLabel}>Explore</span>
            <a href="#why">Why Minels</a>
            <a href="#features">Features</a>
            <a href="#reviews">Who It Helps</a>
          </div>

          <div className={styles.footerColumn}>
            <span className={styles.footerLabel}>Product</span>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/products">Products</Link>
            <Link href="/customers">Customers</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Built for practical day-to-day inventory operations.</p>
          <div className={styles.footerMetaLinks}>
            <Link href="/login">Login</Link>
            <Link href="/register">Create account</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
