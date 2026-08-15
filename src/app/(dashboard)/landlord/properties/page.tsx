// "use client";

// import { useEffect, useState } from "react";
// import { Building2, Edit, Trash2, ExternalLink, RefreshCw, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import Image from "next/image";

// interface Property {
//   _id: string;
//   title: string;
//   desc: string;
//   fullDescription: string;
//   price: number;
//   priceMin?: number;
//   priceMax?: number;
//   location: string;
//   neighborhood: string;
//   neighborhoodLabel: string;
//   type: string;
//   targetAudience: string;
//   amenities: string[];
//   image: string;
//   status: "available" | "rented" | "pending";
// }

// export default function ManageProperties() {
//   const { data: session, isPending: sessionPending } = authClient.useSession();
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Edit modal state
//   const [editingProperty, setEditingProperty] = useState<Property | null>(null);
//   const [updating, setUpdating] = useState(false);

//   // Fetch token from environment cookies/storage
//   const getToken = () => {
//     if (typeof window === "undefined") return "";
//     let token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("better-auth.session_token="))
//       ?.split("=")[1] || "";
    
//     if (!token) {
//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         if (key && key.includes("session_token")) {
//           token = localStorage.getItem(key) || "";
//           break;
//         }
//       }
//     }
//     return token;
//   };

//   const fetchProperties = async () => {
//     if (sessionPending || !session?.user) return;
//     setLoading(true);
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/properties`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const result = await response.json();
//       if (result.success) {
//         setProperties(result.data);
//       } else {
//         toast.error(result.message || "Failed to load properties");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error loading properties");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, [session, sessionPending]);

//   // Toggle status
//   const handleToggleStatus = async (property: Property) => {
//     const newStatus = property.status === "available" ? "rented" : "available";
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/properties/${property._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
//       const result = await response.json();
//       if (result.success) {
//         toast.success(`Property status changed to ${newStatus}`);
//         setProperties(properties.map(p => p._id === property._id ? { ...p, status: newStatus } : p));
//       } else {
//         toast.error(result.message || "Failed to update property status");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error updating status");
//     }
//   };

//   // Delete property
//   const handleDeleteProperty = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/properties/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const result = await response.json();
//       if (result.success) {
//         toast.success("Listing deleted successfully");
//         setProperties(properties.filter(p => p._id !== id));
//       } else {
//         toast.error(result.message || "Failed to delete listing");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error deleting listing");
//     }
//   };

//   // Submit edit form
//   const handleUpdateProperty = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!editingProperty) return;
//     setUpdating(true);

//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/properties/${editingProperty._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(editingProperty)
//       });
//       const result = await response.json();
//       if (result.success) {
//         toast.success("Property listing updated!");
//         setProperties(properties.map(p => p._id === editingProperty._id ? result.data : p));
//         setEditingProperty(null);
//       } else {
//         toast.error(result.message || "Failed to save updates");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error updating property");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading || sessionPending) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="flex justify-between items-center">
//           <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
//           <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
//         </div>
//         <div className="bg-white border border-gray-150 rounded-3xl p-6 h-96">
//           <div className="space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="flex gap-4 items-center">
//                 <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
//                 <div className="flex-1 h-4 bg-gray-200 rounded"></div>
//                 <div className="h-4 w-20 bg-gray-200 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 animate-fade-in pb-16">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Manage Listings</h1>
//           <p className="text-xs text-gray-400 mt-1">Review active rental cards, modify details, and switch vacant status.</p>
//         </div>
//         <Link href="/landlord/add-property">
//           <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-bold h-10 px-5 shadow-sm shadow-orange-500/20">
//             List New Flat
//           </Button>
//         </Link>
//       </div>

//       {/* Properties Table */}
//       <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           {properties.length > 0 ? (
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
//                   <th className="py-4 px-6">Flat Listing Info</th>
//                   <th className="py-4 px-6">Room Type & Audience</th>
//                   <th className="py-4 px-6">Monthly Rate</th>
//                   <th className="py-4 px-6">Status</th>
//                   <th className="py-4 px-6 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
//                 {properties.map((item) => (
//                   <tr key={item._id} className="hover:bg-gray-50/40 transition-colors">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-150 shrink-0">
//                           <Image src={item.image} alt={item.title} fill className="object-cover" />
//                         </div>
//                         <div>
//                           <h4 className="font-bold text-gray-950 line-clamp-1">{item.title}</h4>
//                           <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
//                             {item.neighborhoodLabel} • {item.location}
//                           </span>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="space-y-0.5">
//                         <p className="text-gray-900">{item.type}</p>
//                         <span className="text-[9px] bg-slate-100 text-slate-500 uppercase px-1.5 py-0.5 rounded font-bold">
//                           {item.targetAudience}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 text-gray-950 font-bold">${item.price}</td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
//                         item.status === "available"
//                           ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
//                           : item.status === "rented"
//                           ? "bg-slate-100 text-slate-700"
//                           : "bg-amber-50 text-amber-700"
//                       }`}>
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center justify-center gap-2">
//                         <Link href={`/flats/${item._id}`} target="_blank">
//                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-950" title="View Public Page">
//                             <ExternalLink className="w-3.5 h-3.5" />
//                           </Button>
//                         </Link>
//                         <Button 
//                           onClick={() => handleToggleStatus(item)}
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-950" 
//                           title="Toggle Available/Rented"
//                         >
//                           <RefreshCw className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button 
//                           onClick={() => setEditingProperty(item)}
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-700" 
//                           title="Edit Listing"
//                         >
//                           <Edit className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button 
//                           onClick={() => handleDeleteProperty(item._id)}
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8 hover:bg-gray-100 rounded-lg text-red-500 hover:text-red-600" 
//                           title="Delete Listing"
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="py-16 text-center">
//               <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <h3 className="text-sm font-bold text-gray-900">No properties listed yet</h3>
//               <p className="text-xs text-gray-400 mt-1">Get started by creating your first property listing card.</p>
//               <Link href="/landlord/add-property" className="mt-4 inline-block">
//                 <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-bold h-9 px-4">
//                   Create First Listing
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Editing Modal Dialog */}
//       {editingProperty && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
//           <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative border border-gray-100">
//             <button 
//               onClick={() => setEditingProperty(null)}
//               className="absolute top-6 right-6 text-gray-400 hover:text-gray-950 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h2 className="text-xl font-extrabold text-gray-950 mb-6">Modify Property Listing</h2>
//             <form onSubmit={handleUpdateProperty} className="space-y-5 text-left">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
//                   <input 
//                     type="text" 
//                     value={editingProperty.title} 
//                     onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })}
//                     required
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Price ($)</label>
//                   <input 
//                     type="number" 
//                     value={editingProperty.price} 
//                     onChange={e => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
//                     required
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Neighborhood</label>
//                   <select 
//                     value={editingProperty.neighborhood} 
//                     onChange={e => setEditingProperty({ 
//                       ...editingProperty, 
//                       neighborhood: e.target.value,
//                       neighborhoodLabel: e.target.options[e.target.selectedIndex].text 
//                     })}
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   >
//                     <option value="Rupnagar Abashik">Rupnagar Abashik</option>
//                     <option value="itb-bandung">itb-bandung</option>
//                     <option value="coblong">coblong</option>
//                     <option value="all-city">all-city</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Full Location Address</label>
//                   <input 
//                     type="text" 
//                     value={editingProperty.location} 
//                     onChange={e => setEditingProperty({ ...editingProperty, location: e.target.value })}
//                     required
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Room Type</label>
//                   <select 
//                     value={editingProperty.type} 
//                     onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   >
//                     <option value="Private Room">Private Room</option>
//                     <option value="Entire Flat">Entire Flat</option>
//                     <option value="Shared Co-Living">Shared Co-Living</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-[10px] font-bold text-gray-400 uppercase">Target Audience</label>
//                   <select 
//                     value={editingProperty.targetAudience} 
//                     onChange={e => setEditingProperty({ ...editingProperty, targetAudience: e.target.value as any })}
//                     className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//                   >
//                     <option value="bachelor">bachelor</option>
//                     <option value="family">family</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description summary</label>
//                 <textarea 
//                   value={editingProperty.desc} 
//                   onChange={e => setEditingProperty({ ...editingProperty, desc: e.target.value })}
//                   required
//                   rows={2}
//                   className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none resize-none"
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-bold text-gray-400 uppercase">Full Detailed Description</label>
//                 <textarea 
//                   value={editingProperty.fullDescription} 
//                   onChange={e => setEditingProperty({ ...editingProperty, fullDescription: e.target.value })}
//                   required
//                   rows={4}
//                   className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none resize-none"
//                 />
//               </div>

//               <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setEditingProperty(null)}
//                   className="rounded-xl text-xs h-10 px-5"
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   disabled={updating}
//                   className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-10 px-5"
//                 >
//                   {updating ? "Saving Changes..." : "Save Listing"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Building2, Edit, Trash2, ExternalLink, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { publicFetch, serverMutation } from "@/lib/core/server"; 
import { getUserSession } from "@/lib/core/session";

interface Property {
  _id: string;
  title: string;
  desc: string;
  fullDescription: string;
  price: number;
  priceMin?: number;
  priceMax?: number;
  location: string;
  neighborhood: string;
  neighborhoodLabel: string;
  type: string;
  targetAudience: string;
  amenities: string[];
  image: string;
  images?: string[];
  status: "available" | "rented" | "pending";
}

export default function ManageProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit modal state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchProperties = async (currentLandlordId: string) => {
    setLoading(true);
    try {
      const result = await publicFetch(`/api/v1/landlord/properties/${currentLandlordId}`);
      if (result.success) {
        setProperties(result.data);
      } else {
        toast.error(result.message || "Failed to load properties");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUserSession();
        if (user?.id) {
          fetchProperties(user.id);
        } else {
          setLoading(false);
          toast.error("Landlord session not found. Please log in.");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    init();
  }, []);

  // Toggle status using serverMutation
  const handleToggleStatus = async (property: Property) => {
    const newStatus = property.status === "available" ? "rented" : "available";
    try {
      const result = await serverMutation(
        `/api/v1/landlord/properties/${property._id}`,
        { status: newStatus },
        "PUT"
      );
      if (result.success) {
        toast.success(`Property status changed to ${newStatus}`);
        setProperties(properties.map(p => p._id === property._id ? { ...p, status: newStatus } : p));
      } else {
        toast.error(result.message || "Failed to update property status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating status");
    }
  };

  // Delete property using serverMutation
  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property? This cannot be undone.")) return;
    try {
      const result = await serverMutation(
        `/api/v1/landlord/properties/${id}`,
        {},
        "DELETE"
      );
      if (result.success) {
        toast.success("Listing deleted successfully");
        setProperties(properties.filter(p => p._id !== id));
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting listing");
    }
  };

  // Submit edit form using serverMutation
  const handleUpdateProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProperty) return;
    setUpdating(true);

    try {
      const result = await serverMutation(
        `/api/v1/landlord/properties/${editingProperty._id}`,
        editingProperty,
        "PUT"
      );
      if (result.success) {
        toast.success("Property listing updated!");
        setProperties(properties.map(p => p._id === editingProperty._id ? result.data : p));
        setEditingProperty(null);
      } else {
        toast.error(result.message || "Failed to save updates");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating property");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>
        <div className="bg-white border border-gray-150 rounded-3xl p-6 h-96">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Manage Listings</h1>
          <p className="text-xs text-gray-400 mt-1">Review active rental cards, modify details, and switch vacant status.</p>
        </div>
        <Link href="/landlord/add-property">
          <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-bold h-10 px-5 shadow-sm shadow-orange-500/20">
            List New Flat
          </Button>
        </Link>
      </div>

      {/* Properties Table */}
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {properties.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">Flat Listing Info</th>
                  <th className="py-4 px-6">Room Type & Audience</th>
                  <th className="py-4 px-6">Monthly Rate</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                {properties.map((item) => {
                  const displayImg = item.image || item.images?.[0] || "/placeholder.jpg";
                  return (
                    <tr key={item._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-150 shrink-0">
                            <Image src={displayImg} alt={item.title} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-950 line-clamp-1">{item.title}</h4>
                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                              {item.neighborhoodLabel} • {item.location}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="text-gray-900">{item.type}</p>
                          <span className="text-[9px] bg-slate-100 text-slate-500 uppercase px-1.5 py-0.5 rounded font-bold">
                            {item.targetAudience}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-950 font-bold">${item.price}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : item.status === "rented"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/flats/${item._id}`} target="_blank">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-950" title="View Public Page">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => handleToggleStatus(item)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-950" 
                            title="Toggle Available/Rented"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            onClick={() => setEditingProperty(item)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-gray-100 rounded-lg text-blue-600 hover:text-blue-700" 
                            title="Edit Listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteProperty(item._id)}
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-gray-100 rounded-lg text-red-500 hover:text-red-600" 
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-900">No properties listed yet</h3>
              <p className="text-xs text-gray-400 mt-1">Get started by creating your first property listing card.</p>
              <Link href="/landlord/add-property" className="mt-4 inline-block">
                <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-bold h-9 px-4">
                  Create First Listing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Editing Modal Dialog */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => setEditingProperty(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-extrabold text-gray-950 mb-6">Modify Property Listing</h2>
            <form onSubmit={handleUpdateProperty} className="space-y-5 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                  <input 
                    type="text" 
                    value={editingProperty.title} 
                    onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Price ($)</label>
                  <input 
                    type="number" 
                    value={editingProperty.price} 
                    onChange={e => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Neighborhood</label>
                  <select 
                    value={editingProperty.neighborhood} 
                    onChange={e => setEditingProperty({ 
                      ...editingProperty, 
                      neighborhood: e.target.value,
                      neighborhoodLabel: e.target.options[e.target.selectedIndex].text 
                    })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  >
                    <option value="Rupnagar Abashik">Rupnagar Abashik</option>
                    <option value="itb-bandung">itb-bandung</option>
                    <option value="coblong">coblong</option>
                    <option value="all-city">all-city</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Full Location Address</label>
                  <input 
                    type="text" 
                    value={editingProperty.location} 
                    onChange={e => setEditingProperty({ ...editingProperty, location: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Room Type</label>
                  <select 
                    value={editingProperty.type} 
                    onChange={e => setEditingProperty({ ...editingProperty, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Entire Flat">Entire Flat</option>
                    <option value="Shared Co-Living">Shared Co-Living</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Target Audience</label>
                  <select 
                    value={editingProperty.targetAudience} 
                    onChange={e => setEditingProperty({ ...editingProperty, targetAudience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
                  >
                    <option value="bachelor">bachelor</option>
                    <option value="family">family</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description summary</label>
                <textarea 
                  value={editingProperty.desc} 
                  onChange={e => setEditingProperty({ ...editingProperty, desc: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Detailed Description</label>
                <textarea 
                  value={editingProperty.fullDescription} 
                  onChange={e => setEditingProperty({ ...editingProperty, fullDescription: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingProperty(null)}
                  className="rounded-xl text-xs h-10 px-5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updating}
                  className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-10 px-5"
                >
                  {updating ? "Saving Changes..." : "Save Listing"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}