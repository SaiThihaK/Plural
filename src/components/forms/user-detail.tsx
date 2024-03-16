"use client";

import {
  changeUserPermissions,
  getAuthUserDetail,
  getUserPermissions,
  saveActivityLogsNotification,
  upDateUser,
} from "@/lib/queries";
import {
  AuthUserWithAgencySidebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccount,
} from "@/lib/type";
import { useModal } from "@/provider/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import { Select } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import FileUpalod from "../global/file-upload";
import Loading from "../global/loading";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

type Props = {
  subAccount?: SubAccount[];
  type: "agency" | "subaccount";
  id?: string | null;
  userData?: Partial<User>;
};

function UserDetails({ subAccount, type, id, userData }: Props) {
  const [subAccountPermissions, setSetAccountPermissions] =
    useState<UserWithPermissionsAndSubAccount | null>(null);
  const [authUserData, setAuthUserData] =
    useState<AuthUserWithAgencySidebarOptionsSubAccounts | null>(null);
  const [roleState, setRoleState] = useState<string>("");
  const [loadingPermissions, setLoadingPermissions] = useState<boolean>(false);
  const { data, setClose } = useModal();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      if (data.user) {
        const response = await getAuthUserDetail();
        if (response) setAuthUserData(response);
      }
    };
    fetchDetail();
  }, [data]);

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      "AGENCY_OWNER",
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user.id);
      setSetAccountPermissions(permission);
    };
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [data.user, userData]);

  const onSubmit = async (value: z.infer<typeof userDataSchema>) => {
    if (!id) return;
    if (userData || data.user) {
      const updateUser = await upDateUser(value);
      authUserData?.Agency?.SubAccount.filter((sub) => {
        authUserData.Permissions.find(
          (per) => per.subAccountId === sub.id && per.access
        );
      }).forEach(async (subAccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subAccountId: subAccount.id,
        });
      });
      if (updateUser) {
        toast({
          title: "Success",
          description: "Update User Information",
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Oppse!",
          description: "Could not update user information",
        });
      }
    } else {
      console.log("Error could not submit");
    }
  };

  const onChangePermission = async (
    subAccountId: string,
    val: boolean,
    permissionsId: string | undefined
  ) => {
    if (!data.user?.email) return;
    setLoadingPermissions(true);
    const response = await changeUserPermissions(
      permissionsId ? permissionsId : v4(),
      data.user.email,
      subAccountId,
      val
    );

    if (type === "agency") {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find(
            (p) => p.subAccountId === subAccountId
          )?.SubAccount.name
        } `,
        subAccountId: subAccountPermissions?.Permissions.find(
          (p) => p.subAccountId === subAccountId
        )?.SubAccount.id,
      });
    }
    if (response) {
      toast({
        title: "Success",
        description: "The request was successfull",
      });
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((perm) => {
          if (perm.subAccountId === subAccountId) {
            return { ...perm, access: !perm.access };
          }
          return perm;
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Could not update permissions",
        });
      }
      router.refresh();
      setLoadingPermissions(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Detials</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpalod
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel> User Role</FormLabel>
                  <Select
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "You need to have subaccounts to assign Subaccount access to team members."
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMING">
                        Agency Admin
                      </SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save User Details"}
            </Button>
          </form>
        </Form>
        {authUserData?.role === "AGENCY_OWNER" && (
          <div>
            <Separator className="my-4" />
            <FormLabel> User Permissions</FormLabel>
            <FormDescription className="mb-4">
              You can give Sub Account access to team member by turning on
              access control for each Sub Account. This is only visible to
              agency owners
            </FormDescription>
            <div className="flex flex-col gap-4">
              {subAccount?.map((subAccount) => {
                const subAccountPermissionsDetails =
                  subAccountPermissions?.Permissions.find(
                    (p) => p.subAccountId === subAccount.id
                  );
                return (
                  <div
                    key={subAccount.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p>{subAccount.name}</p>
                    </div>
                    <Switch
                      disabled={loadingPermissions}
                      checked={subAccountPermissionsDetails?.access}
                      onCheckedChange={(permission) => {
                        onChangePermission(
                          subAccount.id,
                          permission,
                          subAccountPermissionsDetails?.id
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UserDetails;
