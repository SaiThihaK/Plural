import { getAuthUserDetail } from "@/lib/queries";

type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getAuthUserDetail();
  if (user?.Agency) return;
  return <div></div>;
};

export default Sidebar;
