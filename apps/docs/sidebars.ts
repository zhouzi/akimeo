import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  simulateurs: [
    {
      type: "doc",
      id: "simulateurs/index",
    },
    {
      type: "category",
      label: "Simulateurs",
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "simulateurs/concubinage-vs-pacs",
        },
      ],
    },
  ],
};

export default sidebars;
