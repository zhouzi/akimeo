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
          <h1>Pilotez plus efficacement votre activité</h1>
          <p>
            Akimeo est une suite d'outils permettant aux indépendants de mieux
            comprendre les enjeux juridiques, comptables, fiscaux et financiers
            de leur situation.
          </p>
          <Link
            className="button button--primary button--lg"
            to="/docs/simulateurs/"
          >
            Découvrir les simulateurs
          </Link>
        </div>
      </section>
    </Layout>
  );
}
