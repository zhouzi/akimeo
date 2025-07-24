import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

export default function Page() {
  return (
    <Layout>
      <section
        className={styles.outerContainer}
        style={{
          backgroundImage: `url("/assets/texture-background.png"), linear-gradient(0deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 1) 100%), url("/assets/gradient-background.svg")`,
          backgroundSize: "400px, cover, cover",
          backgroundRepeat: "repeat, no-repeat, no-repeat",
          backgroundBlendMode: "soft-light, normal, normal",
        }}
      >
        <div className={styles.container}>
          <h1>Ne vendez pas, éduquez</h1>
          <p>
            Permettez à vos prospects de mesurer les bénéfices concrets de vos
            services avec des simulateurs faciles à utiliser.
          </p>
          <Link
            className="button button--primary button--lg"
            to="/docs/simulateurs/"
          >
            Découvrir les simulateurs
          </Link>
        </div>
      </section>
      <section style={{ textAlign: "center", padding: "32px 0" }}>
        <p>
          Cette page est en cours de re-construction. En attendant,{" "}
          <a href="https://go.gabin.app/linkedin" target="_blank">
            retrouvez-moi sur LinkedIn
          </a>
          .
        </p>
      </section>
    </Layout>
  );
}
