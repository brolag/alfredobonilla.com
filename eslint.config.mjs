import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Keep existing document navigations and interactive state warnings visible
    // while the runtime upgrade is reviewed separately from UI refactors.
    files: [
      "app/(legacy)/layout.tsx",
      "app/components/CyberCity.tsx",
      "app/components/desktop/Banner.tsx",
      "app/components/desktop/Desktop.tsx",
      "app/components/desktop/useTerminal.tsx",
      "app/components/paper/LinksPaper.tsx",
      "app/components/paper/PaperScene.tsx",
      "app/components/paper/PaperSite.tsx",
      "app/components/paper/SocialPaper.tsx",
      "app/components/world/WorldExperience.tsx",
    ],
    rules: {
      "@next/next/no-html-link-for-pages": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
