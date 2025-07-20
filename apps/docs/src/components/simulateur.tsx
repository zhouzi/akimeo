import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useEffect, useRef } from "react";
import styles from "./simulateur.module.css";

declare global {
  interface Window {
    createAkimeoEmbed?: (container: HTMLElement, path: string) => void;
  }
}

interface SimulateurProps {
  path: string;
}

export function Simulateur({ path }: SimulateurProps) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const simulateurContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (simulateurContainerRef.current == null) {
      return;
    }

    if (!window.createAkimeoEmbed) {
      const script = window.document.createElement("script");
      script.src = new URL(
        "/iframe.js",
        typeof customFields.simulateursHostname === "string"
          ? `https://${customFields.simulateursHostname}`
          : `http://localhost:3001`
      ).toString();

      window.document.body.appendChild(script);
      return;
    }

    window.createAkimeoEmbed(simulateurContainerRef.current, path);
  }, []);

  return (
    <div>
      <div
        ref={simulateurContainerRef}
        data-simulateur={path}
        className={styles.simulateurContainer}
      />
      <p className={styles.disclaimer}>
        Ce simulateur est là pour t'aider à mieux comprendre, mais il ne
        remplace pas une analyse complète de ta situation. Chaque cas est
        unique, alors n'hésite pas à creuser ou à demander conseil si besoin.
      </p>
    </div>
  );
}
