"use client";

import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import { useMemo } from "react";

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
  defaultOpen,
  sidebarLogo,
  subAccounts,
  sidebarOpt,
  details,
  id,
  user,
}: Props) => {
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : null),
    [defaultOpen]
  );
  return <div>MenuOptions</div>;
};

export default MenuOptions;
