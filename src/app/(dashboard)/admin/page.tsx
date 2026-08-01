import { ShieldCheck, UserCheck, Landmark, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
    return (
      <div className="w-full min-h-screen bg-gray-50/30 space-y-10 animate-fade-in">
      
      {/* Top Banner Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-default-900">System Core Console</h1>
          <p className="text-xs text-default-400 mt-1">Platform-wide verification logs, user provisioning, and escrow settlement status.</p>
        </div>
        <Button className="bg-black text-white rounded-full text-xs font-semibold px-5 h-9 w-fit">
          <ShieldCheck className="w-4 h-4 mr-1.5" /> Security Logs
        </Button>
      </div>

      {/* Admin Operations Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Pending Verifications", val: "18 Listings", sub: "Requires image audit", icon: Building2, color: "text-amber-600 bg-amber-50" },
          { label: "Flagged Accounts", val: "2 Users", sub: "Spam behavior warning", icon: UserCheck, color: "text-red-600 bg-red-50" },
          { label: "Active Escrow Vaults", val: "$42,850", sub: "Secure settlement buffer", icon: Landmark, color: "text-blue-600 bg-blue-50" },
          { label: "Platform Growth (Mo)", val: "+14.8%", sub: "New contracts signed", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-default-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-default-400 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-default-950 tracking-tight">{stat.val}</h3>
              <p className="text-[10px] text-default-400 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Queue Section Container */}
      <div className="bg-white border border-default-100 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-default-950">Property Listings Verification Queue</h3>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            Action Required
          </span>
        </div>
        <div className="divide-y divide-default-50">
          {[
            { id: "PROP-9402", title: "Skyline Premium Suite Room 3", owner: "Landlord: Michael K.", location: "Jatinangor Area" },
            { id: "PROP-8821", title: "Cozy Corner Share Room B", owner: "Landlord: Sarah J.", location: "Near ITB Campus" },
            { id: "PROP-7391", title: "Urban Nest Shared Studio Center", owner: "Landlord: David L.", location: "Bandung City" },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-default-100 text-default-600 px-1.5 py-0.5 rounded">
                    {item.id}
                  </span>
                  <h4 className="text-xs font-bold text-default-900">{item.title}</h4>
                </div>
                <p className="text-[10px] text-default-400 mt-0.5">{item.owner} • {item.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="destructive" className="rounded-full text-[11px] h-8 font-medium">
                  Reject
                </Button>
                <Button size="sm" className="bg-black text-white rounded-full text-[11px] h-8 font-semibold">
                  Approve Listing
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    );
};

export default AdminPage;