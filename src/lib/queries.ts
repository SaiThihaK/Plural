"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { User } from "@prisma/client";

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
