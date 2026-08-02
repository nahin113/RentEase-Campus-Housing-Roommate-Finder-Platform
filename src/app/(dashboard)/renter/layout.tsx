const { requireRole } = require("@/lib/core/session");

export const metadata = {
  title: "RentEase Dashboard Renters",
  description: "Dashboard for Renters",
};

const RenterLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("renter");
  return children;
};

export default RenterLayout;
