import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

type Props = {
  agencyId: string;
};

const SettingPage = async ({ agencyId }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return;
  const userDetails = await db.user.findUnique({
    where: {
      email: authUser?.emailAddresses[0].emailAddress,
    },
  });
  if (!userDetails) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return null;
  return <div>SettingPage</div>;
};

export default SettingPage;
