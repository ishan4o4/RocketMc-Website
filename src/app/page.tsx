import { SiteShell } from "@/components/site/shell";
import { ThemeProvider } from "@/components/site/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
      <SiteShell />
    </ThemeProvider>
  );
}
