"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Search, Eye, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicFetch, serverMutation } from "@/lib/core/server";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LandlordInfo {
  name: string;
  email: string;
  image?: string;
}

interface PropertyItem {
  _id: string;
  title: string;
  desc: string;
  fullDescription: string;
  price: number;
  location: string;
  neighborhoodLabel: string;
  status: "available" | "rented" | "pending" | string;
  image: string;
  images?: string[];
  landlordId?: LandlordInfo;
  createdAt: string;
}

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const res = await publicFetch("/api/admin/properties");
        if (res?.success && Array.isArray(res.data)) {
          setProperties(res.data);
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const query = searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        p.title?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query)
    );
  }, [properties, searchQuery]);

  const handleDelete = async (propertyId: string) => {
    try {
      const res = await serverMutation(`/api/admin/properties/${propertyId}`, {}, "DELETE");
      if (res?.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30 space-y-10 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-950 uppercase">Approve & Moderation Listings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review live advertisements, preview user-submitted listings, and delete invalid or fraudulent posts.
        </p>
      </div>

      {/* Control Actions / Search bar */}
      <div className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-3xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-150 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f15a14] transition-all"
          />
        </div>
      </div>

      {/* Properties Moderation Table */}
      <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Landlord</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rent Rate</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-9 rounded-lg bg-gray-100 shrink-0" />
                        <Skeleton className="h-4 w-32 bg-gray-100" />
                      </div>
                    </td>
                    <td className="p-5"><Skeleton className="h-4 w-28 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-4 w-24 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-4 w-16 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-5 w-16 rounded-full bg-gray-100" /></td>
                    <td className="p-5 text-right"><Skeleton className="h-8 w-24 rounded-full bg-gray-100 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs font-bold text-gray-400 uppercase">
                    No properties listed
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-150 shrink-0">
                          <Image
                            src={property.images?.[0] || property.image || "/placeholder.jpg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-950 truncate max-w-[200px] block">
                          {property.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-900">{property.landlordId?.name || "Unknown Landlord"}</span>
                        <span className="text-[10px] text-gray-400">{property.landlordId?.email || ""}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#f15a14] shrink-0" />
                        <span className="truncate max-w-[120px]">{property.location}</span>
                      </div>
                    </td>
                    <td className="p-5 text-xs font-extrabold text-gray-950">
                      ৳{property.price?.toLocaleString()}
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          property.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : property.status === "rented"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => setSelectedProperty(property)}
                          className="rounded-full text-[10px] font-bold uppercase tracking-wider h-8 w-8 p-0 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirmId(property._id)}
                          className="rounded-full text-[10px] font-bold uppercase tracking-wider h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Listing Modal */}
      {selectedProperty && (
        <Dialog open={true} onOpenChange={() => setSelectedProperty(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 font-sans">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-gray-950 uppercase tracking-tight">
                {selectedProperty.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-150">
                <Image
                  src={selectedProperty.images?.[0] || selectedProperty.image || "/placeholder.jpg"}
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Asking Price</span>
                  <span className="text-lg font-black text-gray-950">৳{selectedProperty.price?.toLocaleString()} / mo</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#f15a14]" /> {selectedProperty.location}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-gray-950 uppercase tracking-wider block">Landlord Details</span>
                <div className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-[#f15a14]">
                    {selectedProperty.landlordId?.name?.[0]?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{selectedProperty.landlordId?.name || "Unknown Landlord"}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{selectedProperty.landlordId?.email || ""}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-gray-950 uppercase tracking-wider block">Description</span>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-line">
                  {selectedProperty.fullDescription || selectedProperty.desc}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Dialog open={true} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="max-w-md rounded-3xl p-6 font-sans">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-gray-950 uppercase tracking-tight flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" /> Revoke Property Post
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-3">
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Are you sure you want to permanently delete this listing from the database? This action is irreversible and the listing will immediately disappear from student browse pages.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => setDeleteConfirmId(null)}
                  variant="outline"
                  className="rounded-full text-xs font-bold uppercase tracking-wider h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider h-9"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
