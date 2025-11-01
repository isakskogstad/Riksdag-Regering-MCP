import { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Riksdag & Regering</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold mb-3">Om tjänsten</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                En informationstjänst för svenska politiska institutioner. Denna tjänst är inte officiell.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Tillgänglighet</h3>
              <p className="text-xs text-muted-foreground">
                Vi strävar efter WCAG 2.1 AA-standard för att säkerställa tillgänglighet för alla användare.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Kontakt</h3>
              <p className="text-xs text-muted-foreground">
                För frågor om tjänsten, kontakta administratören.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Svenska AI-tjänster. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
