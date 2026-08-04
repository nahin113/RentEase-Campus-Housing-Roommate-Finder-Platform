import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const authHeader = async () => {
  // const token = await getUserToken();
  // const header :Record<string, string> | {} = token
  //   ? {
  //       authorization: `Bearer ${token}`,
  //     }
  //   : {}
  // return header;    
  return {};
};

export const serverMutation = async (path:string, data:any, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers : {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });
  return handleStatusCode(res);
};

export const serverFetch = async (path:string) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });
  return handleStatusCode(res);
};

export const publicFetch = async (path:string) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  return handleStatusCode(res);
};

const handleStatusCode = (res:any) => {
  if (res.status === 401) redirect("/unauthorized");
  else if (res.status === 403) redirect("/forbidden");
  return res.json();
};
