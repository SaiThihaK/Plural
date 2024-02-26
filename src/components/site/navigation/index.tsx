import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type NavigationProps = {
  user?: null | User;
};

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  return (
    <div className="flex justify-between items-center p-4 relative">
      <aside className="flex items-center gap-2">
        <Image
          src="/assets/plura-logo.svg"
          width={40}
          height={40}
          alt="Plura Logo"
        />
        <span className="text-xl font-bold">Plura.</span>
      </aside>
      <nav className="absolute left-[50%] top-[50%] hidden md:block transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex justify-center items-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex justify-center items-center gap-2">
        <Link
          href={"/ageny"}
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
