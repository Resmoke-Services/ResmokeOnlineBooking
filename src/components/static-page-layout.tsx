
import type { FC, ReactNode } from 'react';
import { StaticHeader } from './static-header';

interface StaticPageLayoutProps {
  children: ReactNode;
}

const StaticPageLayout: FC<StaticPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StaticHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
      <footer className="py-4 mt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Resmoke Services. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StaticPageLayout;
