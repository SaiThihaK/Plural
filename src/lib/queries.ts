"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { Agency, Plan, User } from "@prisma/client";

import { redirect } from "next/navigation";

import { db } from "./db";

export const getAuthUserDetail = async () => {
  const user = await currentUser();
  if (!user) return;
  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  });
  return userData;
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return;
  const response = await db.user.create({ data: { ...user } });
  return response;
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  description: string;
  subAccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: agencyId },
          },
        },
      },
    });

    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser?.emailAddresses[0].emailAddress,
      },
    });
    if (!userData) {
      console.log("Could not find user data");
      return;
    }
    let foundAgencyId = agencyId;
    if (!foundAgencyId) {
      if (!subAccountId) {
        throw new Error("Please provide agency or subaccount");
      }
    }
    const response = await db.subAccount.findUnique({
      where: {
        id: subAccountId,
      },
    });
    if (response) foundAgencyId = response.agencyId;
    if (subAccountId) {
      await db.notification.create({
        data: {
          notification: `${userData.name} | ${description}`,
          User: {
            connect: {
              id: userData.id,
            },
          },
          Agency: {
            connect: { id: foundAgencyId },
          },
          SubAccount: {
            connect: {
              id: subAccountId,
            },
          },
        },
      });
    } else {
      await db.notification.create({
        data: {
          notification: `${userData.name} | ${description}`,
          User: {
            connect: {
              id: userData.id,
            },
          },
          Agency: {
            connect: { id: foundAgencyId },
          },
        },
      });
    }
  }
};

export const verifyAndAccpectInvitation = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user?.emailAddresses[0].emailAddress,
      status: "PENDING",
    },
  });

  if (invitationExists) {
    const userDetail = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId,
      description: "Joined",
      subAccountId: undefined,
    });
    if (userDetail) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetail.role || "SUBACCOUNT_USER",
        },
      });
      await db.invitation.delete({
        where: {
          email: userDetail.email,
        },
      });
      return userDetail.agencyId;
    } else return null;
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return agency ? agency.agencyId : null;
  }
};

export const updateAgencyDetail = async (
  agencyId: string,
  agencyDetail: Partial<Agency>
) => {
  const response = await db.agency.update({
    where: {
      id: agencyId,
    },
    data: { ...agencyDetail },
  });
  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: { id: agencyId },
  });
  return response;
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;
  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || "SUBACCOUNT_USER",
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || "AGENCY_OWNER",
    },
  });
  return userData;
};

export const upsertAgency = async (agency: Agency, plan?: Plan) => {
  if (!agency.companyEmail) return;
  try {
    const companyDetail = await db.agency.upsert({
      where: {
        id: agency.id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: [
            {
              name: "Dashboard",
              icon: "category",
              link: `/agency/${agency.id}`,
            },
            {
              name: "Launchpad",
              icon: "clipboardIcon",
              link: `/agency/${agency.id}/launchpad`,
            },
            {
              name: "Billing",
              icon: "payment",
              link: `/agency/${agency.id}/billing`,
            },
            {
              name: "Settings",
              icon: "settings",
              link: `/agency/${agency.id}/settings`,
            },
            {
              name: "Sub Accounts",
              icon: "person",
              link: `/agency/${agency.id}/all-subaccounts`,
            },
            {
              name: "Team",
              icon: "shield",
              link: `/agency/${agency.id}/team`,
            },
          ],
        },
      },
    });

    return companyDetail;
  } catch (error) {}
};

export const getnotificationandAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
