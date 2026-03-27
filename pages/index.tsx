import Image from "next/image";
import Link from "next/link";
import {
  BarChartOutlined,
  CreditCardOutlined,
  InboxOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";

const highlights = [
  {
    icon: <BarChartOutlined />,
    text: "Clear inventory visibility",
  },
  {
    icon: <CreditCardOutlined />,
    text: "Customer debt tracking",
  },
  {
    icon: <InboxOutlined />,
    text: "Purchase and stock awareness",
  },
];

const workflow = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "See the state of the business",
    description: "Start with one clear operational snapshot.",
  },
  {
    icon: <LoginOutlined />,
    title: "Move into the product fast",
    description: "Guide visitors directly to login or registration.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Inventory clarity for growing businesses</div>
          <h1>Minels gives your inventory operation a calmer, sharper command center.</h1>
          <p className={styles.lead}>
            Replace patchy tracking with a homepage that clearly points people into the
            product, explains the value fast, and makes the system feel trustworthy from
            the first click.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/login" className={styles.primaryCta}>
              Login
            </Link>
            <Link href="/register" className={styles.secondaryCta}>
              Create account
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
              <h2>Know what needs attention before the day gets noisy.</h2>
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

      <section className={styles.storyGrid}>
        <div className={styles.storyCard}>
          <p className={styles.sectionLabel}>Why teams adopt it</p>
          <h3>Built for businesses that want less friction, not more software.</h3>
          <ul className={styles.highlightList}>
            {highlights.map((highlight) => (
              <li key={highlight.text}>
                <span className={styles.listIcon}>{highlight.icon}</span>
                <span>{highlight.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.storyCardAlt}>
          <p className={styles.sectionLabel}>What the homepage now does</p>
          <h3>It sells the product, guides the visitor, and stays useful on mobile.</h3>
          <div className={styles.workflowList}>
            {workflow.map((item, index) => (
              <article key={item.title} className={styles.workflowItem}>
                <span className={styles.workflowBadge}>{item.icon}</span>
                <div>
                  <small>{`0${index + 1}`}</small>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
