const { requireRole } = require("@/lib/core/session");

export const metadata = {
  title: "RentEase Dashboard Admin",
  description: "Dashboard for Admins",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("admin");
  return children;
};

export default AdminLayout;
