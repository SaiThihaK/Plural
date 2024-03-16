import AgencyDetail from "@/components/forms/agency-detail";
import UserDetails from "@/components/forms/user-detail";
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

  const agencyDetails = await db.agency.findFirst({
    where: {
      id: agencyId,
    },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return null;
  return (
    <div className="flex flex-col  gap-4">
      <AgencyDetail data={agencyDetails} />
      <UserDetails
        type="agency"
        userData={userDetails}
        id={agencyId}
        subAccount={agencyDetails.SubAccount}
      />
    </div>
  );
};

export default SettingPage;
