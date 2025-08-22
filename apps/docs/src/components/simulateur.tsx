import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { AkimeoEmbed } from "@akimeo/embed/react/akimeo-embed";
import styles from "./simulateur.module.css";

interface SimulateurProps {
  path: string;
}

export function Simulateur({ path }: SimulateurProps) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  return (
    <div>
      <AkimeoEmbed
        path={path}
        scriptOrigin={
          typeof customFields.simulateursHostname === "string"
            ? `https://${customFields.simulateursHostname}`
            : `http://localhost:3001`
        }
      />
      <p className={styles.disclaimer}>
        Ce simulateur est là pour t'aider à mieux comprendre, mais il ne
        remplace pas une analyse complète de ta situation. N'hésite pas à
        creuser ou à demander conseil si besoin.
      </p>
    </div>
  );
}
