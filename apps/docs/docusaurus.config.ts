import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const LIBRAIRIES = ["modele", "fiscal"];

const config: Config = {
  title: "Akimeo",
  tagline: "Des réponses simples à des questions compliquées.",
  // favicon: "img/favicon.ico",
  future: {
    v4: true,
  },
  url: "https://akimeo.xyz",
  baseUrl: "/",
  organizationName: "zhouzi",
  projectName: "akimeo",
  customFields: {
    simulateursHostname: process.env.SIMULATEURS_HOSTNAME,
  },
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/zhouzi/akimeo/tree/main/apps/docs/",
        },
        blog: {
          blogSidebarTitle: "Les derniers articles",
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: "https://github.com/zhouzi/akiemo/tree/main/apps/docs/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    ...LIBRAIRIES.map((librairie) => [
      "docusaurus-plugin-typedoc",
      {
        id: librairie,
        entryPoints: [`../../packages/${librairie}/src/index.ts`],
        tsconfig: `../../packages/${librairie}/tsconfig.build.json`,
        out: `docs/librairies/api/${librairie}`,
        pageTitleTemplates: {
          index: "{projectName} {version}",
          member: "{name}",
          module: "{name}",
        },
      },
    ]),
  ],
  themeConfig: {
    // image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Akimeo",
      logo: {
        alt: "",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "librairies",
          position: "left",
          label: "Librairies",
        },
        {
          type: "docSidebar",
          sidebarId: "simulateurs",
          position: "left",
          label: "Simulateurs",
        },
        {
          to: "/blog",
          label: "Blog",
          position: "left",
        },
        {
          href: "https://github.com/zhouzi/akimeo",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Librairies",
          items: [
            ...LIBRAIRIES.slice(0, 5).map((librairie) => ({
              label: `@akimeo/${librairie}`,
              to: `/docs/librairies/api/${librairie}/`,
            })),
            {
              label: "Toutes les librairies",
              to: "/docs/librairies/",
            },
          ],
        },
        {
          title: "Simulateurs",
          items: [
            {
              label: "Concubinage vs PACS",
              to: "/docs/simulateurs/concubinage-vs-pacs",
            },
            {
              label: "Tous les simulateurs",
              to: "/docs/simulateurs/",
            },
          ],
        },
        {
          title: "Retrouvez-nous",
          items: [
            {
              label: "LinkedIn",
              href: "https://go.gabin.app/linkedin",
            },
            {
              label: "Twitter",
              href: "https://go.gabin.app/twitter",
            },
            {
              label: "GitHub",
              href: "https://go.gabin.app/github",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Akimeo, par Artisan du Code.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
