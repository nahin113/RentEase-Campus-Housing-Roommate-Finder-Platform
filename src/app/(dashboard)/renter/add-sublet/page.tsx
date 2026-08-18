"use client";

import { useState } from "react";
import { X, Check, Building, Plus, Minus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { serverMutation } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";

const AMENITY_OPTIONS = [
  "High-speed Wi-Fi",
  "Air Conditioning",
  "Attached Bathroom",
  "Shared Kitchen",
  "Washing Machine",
  "Refrigerator",
  "Generator Backup",
  "24/7 Security",
  "CCTV Surveillance",
  "Balcony",
  "Elevator",
  "Dining Space"
];

const POPULAR_NEIGHBORHOODS = [
  "Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", 
  "Rupnagar Abashik", "Bashundhara R/A", "Mohammadpur", "Badda", "Khilgaon"
];

export default function RenterAddSublet() {
  const router = useRouter();
  const { isPending: sessionPending } = authClient.useSession();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [location, setLocation] = useState("");
  const [neighborhood, setNeighborhood] = useState("Rupnagar Abashik");
  const [neighborhoodQuery, setNeighborhoodQuery] = useState("Rupnagar Abashik");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);
  const [type, setType] = useState("Private Room"); // Default to Private Room
  const [targetAudience, setTargetAudience] = useState("both");
  const [desc, setDesc] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNeighborhoodQuery(val);
    setNeighborhood(val);
    setShowSuggestions(true);
    setActiveSuggestionIdx(0);
  };

  const filteredSuggestions = POPULAR_NEIGHBORHOODS.filter(item =>
    item.toLowerCase().includes(neighborhoodQuery.toLowerCase())
  );

  const selectSuggestion = (suggestion: string) => {
    setNeighborhoodQuery(suggestion);
    setNeighborhood(suggestion);
    setShowSuggestions(false);
  };

  const handleNeighborhoodKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions[activeSuggestionIdx]) {
        selectSuggestion(filteredSuggestions[activeSuggestionIdx]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Occupancy & Rules
  const [minPerson, setMinPerson] = useState(1);
  const [maxPerson, setMaxPerson] = useState(2);
  const [condition, setCondition] = useState("well_maintained");
  const [gateClosingTime, setGateClosingTime] = useState("11:00 PM");

  // Room specs (For Sublets: Private Room or Shared Co-Living)
  const [roomSizeSqFt, setRoomSizeSqFt] = useState("");
  const [bathroomType, setBathroomType] = useState("attached");
  const [bedType, setBedType] = useState("single");

  // Images upload via external ImgBB API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "d216503c14d9b736746ef7414dfa4f00";
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      } else {
        toast.error("Failed to upload images to ImgBB");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload request failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Amenities toggle
  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== name));
    } else {
      setSelectedAmenities([...selectedAmenities, name]);
    }
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !selectedAmenities.includes(trimmed)) {
      setSelectedAmenities([...selectedAmenities, trimmed]);
      setCustomAmenity("");
    }
  };

  // Form Submit using serverMutation helper
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.warning("Please upload at least one property photo before listing");
      return;
    }
    const user = await getUserSession();

    setSaving(true);
    try {
      const neighborhoodLabel = neighborhood;

      const payload = {
        title,
        landlordId: user?.id,
        price: Number(price),
        serviceCharge: Number(serviceCharge) || 0,
        location,
        neighborhood,
        neighborhoodLabel,
        type,
        targetAudience,
        desc,
        fullDescription,
        image: images[0], // Primary cover image
        images,            // Array of all uploaded images
        amenities: selectedAmenities,
        occupancyLimits: {
          minPerson,
          maxPerson
        },
        condition,
        gateClosingTime,
        roomSpecs: {
          roomSizeSqFt: Number(roomSizeSqFt) || undefined,
          bathroomType,
          bedType
        }
      };

      const result = await serverMutation(`/api/sublets/create/${user?.id}`, payload, "POST");

      if (result?.success || result) {
        toast.success("Your sublet listing has been submitted and is awaiting Admin Approval.");
        router.push("/renter");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to create sublet listing");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Network error submitting sublet listing");
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-t-[#f15a14] border-gray-100 rounded-full animate-spin" />
        <span className="text-xs text-gray-400 font-semibold">Resolving session identity...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">Post New Sublet</h1>
        <p className="text-xs text-gray-400 mt-1">Submit sublet location specifics, room details, and monthly rates.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Core details */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
            <Building className="w-4 h-4 text-[#f15a14]" /> Sublet General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Sublet Title</label>
              <input 
                type="text" 
                placeholder="e.g. Quiet Private Room near Campus"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Price (TK)</label>
              <input 
                type="number" 
                placeholder="Monthly rate in TK"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Service Charge (TK)</label>
              <input 
                type="number" 
                placeholder="Monthly service fee in TK"
                value={serviceCharge}
                onChange={e => setServiceCharge(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Sublet Listing Type</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "Private Room", label: "Private Room", desc: "Private room with shared living areas" },
                  { value: "Shared Co-Living", label: "Shared Co-Living", desc: "Shared bed / room space with roomies" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      type === opt.value
                        ? "border-[#f15a14] bg-orange-50/20 text-gray-950"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 bg-white"
                    }`}
                  >
                    <span className="font-extrabold text-xs block mb-0.5">{opt.label}</span>
                    <span className="text-[9px] font-medium text-gray-400 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Preferred Renter (Tenant Preference)</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "bachelor", label: "Bachelor Only", desc: "Students / Job Holders" },
                  { value: "family", label: "Family Only", desc: "Married couples / Families" },
                  { value: "both", label: "Both / Open to All", desc: "No tenant type restriction" }
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTargetAudience(opt.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      targetAudience === opt.value
                        ? "border-[#f15a14] bg-orange-50/20 text-gray-950"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 bg-white"
                    }`}
                  >
                    <span className="font-extrabold text-xs block mb-0.5">{opt.label}</span>
                    <span className="text-[9px] font-medium text-gray-400 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Neighborhood Area</label>
              <input
                type="text"
                placeholder="Type neighborhood name..."
                value={neighborhoodQuery}
                onChange={handleNeighborhoodChange}
                onKeyDown={handleNeighborhoodKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-gray-150 rounded-2xl shadow-xl max-h-48 overflow-y-auto z-50 py-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion}
                      onMouseDown={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setActiveSuggestionIdx(index)}
                      className={`px-4 py-2 text-xs cursor-pointer font-semibold transition-colors ${
                        index === activeSuggestionIdx
                          ? "bg-orange-50 text-[#f15a14]"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Full Location Address</label>
              <input 
                type="text" 
                placeholder="e.g. Rupnagar R/A, Road 14, House 5, Mirpur"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Room Specifications Section */}
        <div className="space-y-5 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Room Layout & Specifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Room Size (Sq Ft)</label>
              <input 
                type="number" 
                placeholder="e.g. 150"
                value={roomSizeSqFt}
                onChange={e => setRoomSizeSqFt(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Bathroom Type</label>
              <select 
                value={bathroomType}
                onChange={e => setBathroomType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              >
                <option value="attached">Attached Bathroom</option>
                <option value="shared">Shared Bathroom</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Bed & Furnishing Status</label>
              <select 
                value={bedType}
                onChange={e => setBedType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              >
                <option value="single">Single Bed Included</option>
                <option value="double">Double Bed Included</option>
                <option value="bunk">Bunk Bed Included</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Sublet Details & Rules */}
        <div className="space-y-5 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Sublet Details & Rules</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5 p-3 border border-gray-150 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 gap-1.5">
              <span className="text-[10px] font-extrabold text-gray-500 uppercase">Occupancy Limits</span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Min</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMinPerson(Math.max(1, minPerson - 1))}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-100"
                    >
                      <Minus className="w-2.5 h-2.5 text-gray-600" />
                    </button>
                    <span className="text-xs font-black text-gray-950">{minPerson}</span>
                    <button
                      type="button"
                      onClick={() => setMinPerson(minPerson + 1)}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-100"
                    >
                      <Plus className="w-2.5 h-2.5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-gray-200" />
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Max</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMaxPerson(Math.max(minPerson, maxPerson - 1))}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-100"
                    >
                      <Minus className="w-2.5 h-2.5 text-gray-600" />
                    </button>
                    <span className="text-xs font-black text-gray-950">{maxPerson}</span>
                    <button
                      type="button"
                      onClick={() => setMaxPerson(maxPerson + 1)}
                      className="w-5 h-5 rounded-md border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-100"
                    >
                      <Plus className="w-2.5 h-2.5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Flat Condition</label>
              <select 
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              >
                <option value="brand_new">Brand New / Unused</option>
                <option value="recently_renovated">Recently Renovated</option>
                <option value="well_maintained">Well Maintained</option>
                <option value="old">Standard Wear</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Gate Closing Time</label>
              <select 
                value={gateClosingTime}
                onChange={e => setGateClosingTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              >
                <option value="10:00 PM">10:00 PM</option>
                <option value="10:30 PM">10:30 PM</option>
                <option value="11:00 PM">11:00 PM</option>
                <option value="11:30 PM">11:30 PM</option>
                <option value="12:00 AM">12:00 AM (Midnight)</option>
                <option value="No Restriction">No Restriction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Image Uploader */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Property Display Media</h3>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <label className="w-full sm:w-48 h-36 border-2 border-dashed border-gray-300 hover:border-[#f15a14] bg-gray-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="text-center p-4">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-[#f15a14] transition-colors" />
                <span className="text-[10px] font-bold text-gray-500">
                  {uploading ? "Uploading..." : "Upload Cover/Photos"}
                </span>
              </div>
            </label>
            <div className="flex-1 space-y-3">
              <h4 className="text-xs font-bold text-gray-950">Sublet Photos</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Add appealing photos of your room sublet. First photo acts as the cover.
              </p>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={imgUrl} alt={`Upload preview ${index}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-black text-white p-0.5 rounded-full"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Descriptions</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description (Summary)</label>
              <textarea 
                rows={2}
                placeholder="Give a quick, captivating sentence describing this sublet..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Detailed Description</label>
              <textarea 
                rows={4}
                placeholder="Describe room features, roommate profiles, utilities billing, university proximity..."
                value={fullDescription}
                onChange={e => setFullDescription(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="space-y-4 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Select Sublet Amenities</h3>
          
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3.5 py-2 rounded-full border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-black border-black text-white shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {amenity}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input 
              type="text" 
              placeholder="e.g. Attached Balcony"
              value={customAmenity}
              onChange={e => setCustomAmenity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
            />
            <Button
              type="button"
              onClick={addCustomAmenity}
              className="bg-black hover:bg-zinc-800 text-white rounded-xl px-4 text-xs font-bold"
            >
              Add custom
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()} 
            className="rounded-xl text-xs h-11 px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || uploading}
            className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-11 px-6 shadow-md shadow-orange-500/20"
          >
            {saving ? "Creating Sublet Listing..." : "Publish Sublet"}
          </Button>
        </div>

      </form>
    </div>
  );
}
