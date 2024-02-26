import { User } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import React from "react";

type NavigationProps = {
  user?: null | User;
};

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <aside className="flex items-center gap-2">
        <Image
          src="/assets/plura-logo.svg"
          width={40}
          height={40}
          alt="Plura Logo"
        />
      </aside>
    </div>
  );
};

export default Navigation;
