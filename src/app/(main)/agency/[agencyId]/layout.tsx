import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/info-bar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getnotificationandAndUser,
  verifyAndAccpectInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: {
    agencyId: string;
  };
};

const layout = async ({ children, params }: Props) => {
  const agencyId = await verifyAndAccpectInvitation();
  const user = await currentUser();
  if (!user) return redirect("/");
  if (!agencyId) return redirect("/agency");
  if (
    user.privateMetadata.role !== "AGENCY_ADMIN" &&
    user.privateMetadata.role !== "AGENCY_OWNER"
  ) {
    return <Unauthorized />;
  }
  let allNoti: any = [];
  const notifications = await getnotificationandAndUser(agencyId);
  if (notifications) {
    allNoti = notifications;
  }
  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti?.User?.role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default layout;
