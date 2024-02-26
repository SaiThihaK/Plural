import Navigation from "@/components/site/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SiteLayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <Navigation />
      {children}
    </div>
  );
};

export default SiteLayout;
