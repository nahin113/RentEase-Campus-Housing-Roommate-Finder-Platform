import { Building, Users, DollarSign, Wrench, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LandlordPage = () => {
  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Title greeting banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Property Control Panel</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time occupancy metrics and balance streams.</p>
      </div>

      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Asset Items", val: "14 Units", sub: "2 markets processing", icon: Building },
          { label: "Net Occupancy Rate", val: "94.2%", sub: "+2.4% vs last term", icon: Users },
          { label: "Gross Yield (Mo)", val: "$6,240", sub: "98% collection safety", icon: DollarSign },
          { label: "Open Repairs Tasks", val: "3 Urgent", sub: "Assigned to mechanics", icon: Wrench },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
              <div className="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center text-gray-700">
                <stat.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-950 tracking-tight">{stat.val}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main List Section */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-950">Active Managed Flats</h3>
            <Button variant="outline" size="sm" className="text-xs rounded-full h-8 px-4">View All</Button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { name: "Skyline Premium Suite 4B", location: "Jatinangor", status: "Occupied", rent: "$450" },
              { name: "Urban Nest Shared Studio", location: "Bandung City", status: "Occupied", rent: "$290" },
              { name: "Greenfield Co-Living Unit 2", location: "Near ITB Campus", status: "Vacant", rent: "$310" },
            ].map((flat, idx) => (
              <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{flat.name}</h4>
                  <p className="text-[10px] text-gray-400">{flat.location}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    flat.status === 'Occupied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {flat.status}
                  </span>
                  <span className="text-xs font-bold text-gray-950">{flat.rent}<span className="text-[10px] font-normal text-gray-400">/mo</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Promo Container */}
        <div className="lg:col-span-4 bg-black text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">RentEase Premium</span>
            <h3 className="text-xl font-normal tracking-tight mt-2 leading-snug">
              Boost list views using our matching algorithm strategy.
            </h3>
          </div>
          <Button className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-10 transition-colors">
            Promote Listings <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

      </div>

    </div>
  );
};

export default LandlordPage;