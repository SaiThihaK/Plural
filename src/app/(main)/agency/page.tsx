import AgencyDetail from "@/components/forms/agency-detail";
import { getAuthUserDetail, verifyAndAccpectInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const agencyId = await verifyAndAccpectInvitation();
  console.log(agencyId);
  const userDetail = await getAuthUserDetail();

  if (agencyId) {
    if (
      userDetail?.role === "SUBACCOUNT_GUEST" ||
      userDetail?.role === "SUBACCOUNT_USER"
    ) {
      return redirect("/subaccount");
    }
    if (
      userDetail?.role === "AGENCY_ADMIN" ||
      userDetail?.role === "AGENCY_OWNER"
    ) {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("__")[0];
        const stateId = searchParams.state.split("___")[1];
        if (!stateId) {
          return <div>Not Authorized</div>;
        }
        return redirect(
          `/agency/${stateId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/agency/${agencyId}`);
    } else return <div>No Authorized</div>;
  }
  const authUser = await currentUser();
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Created An Agency</h1>
        <AgencyDetail
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default Page;
