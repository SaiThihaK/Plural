import Navigation from "@/components/site/navigation";
import { ClerkProvider } from "@clerk/nextjs";

import { dark } from "@clerk/themes";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <div className="h-full">
        <Navigation />
        {children}
      </div>
    </ClerkProvider>
  );
};

export default SiteLayout;
