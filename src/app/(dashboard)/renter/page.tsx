import { Search, Calendar, Heart, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RenterPage = () => {
  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Title Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, Nahin!</h1>
          <p className="text-xs text-gray-400 mt-1">Here is the active status of your property search network.</p>
        </div>
        <Button className="bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-semibold px-5 h-9 w-fit">
          <Search className="w-3.5 h-3.5 mr-2" /> Find New Flats
        </Button>
      </div>

      {/* Horizontal Status Track Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#f15a14]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Next Lease Pay</p>
            <p className="text-sm font-bold text-gray-950 mt-0.5">July 01, 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:pl-6">
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Saved Flats</p>
            <p className="text-sm font-bold text-gray-950 mt-0.5">6 Residences</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:pl-6">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Roommate Chats</p>
            <p className="text-sm font-bold text-gray-950 mt-0.5">3 Active Matches</p>
          </div>
        </div>
      </div>

      {/* Applications Tracking Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-950 mb-4">Submitted Applications Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-50 font-semibold">
                <th className="pb-3 font-medium">Residence Asset Name</th>
                <th className="pb-3 font-medium">Applied Date</th>
                <th className="pb-3 font-medium">Review Status</th>
                <th className="pb-3 font-medium text-right">Rent Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "Urban Nest Living Complex", date: "June 12, 2026", status: "Under Review", color: "text-amber-600 bg-amber-50" },
                { name: "Campus Edge Premium Studio", date: "May 28, 2026", status: "Approved & Verified", color: "text-emerald-600 bg-emerald-50" }
              ].map((app, i) => (
                <tr key={i} className="text-gray-900 font-medium">
                  <td className="py-4 font-bold">{app.name}</td>
                  <td className="py-4 text-gray-400">{app.date}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${app.color}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold">$220<span className="text-[10px] text-gray-400 font-normal">/mo</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default RenterPage;