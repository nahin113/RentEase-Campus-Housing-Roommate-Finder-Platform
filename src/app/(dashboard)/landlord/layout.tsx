const { requireRole } = require("@/lib/core/session");

export const metadata = {
  title: "RentEase Dashboard Landlord",
  description: "Dashboard for Landlords",
};

const LandlordLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireRole("landlord");
  return children;
};

export default LandlordLayout;
