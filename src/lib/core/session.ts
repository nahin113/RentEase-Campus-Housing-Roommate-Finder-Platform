"use server";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
};

export const getUserToken = async () => {
  const tokenData = await auth.api.getToken({
    headers: await headers(),
  });

  return tokenData?.token || null;
};

export const requireRole = async (role:string) => {
  const user = await getUserSession();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (user?.accountType !== role) redirect("/unauthorized");
  return user;
};
