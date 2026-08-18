// "use client";

// import { useState } from "react";
// import { Upload, X, Check, Building } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// const AMENITY_OPTIONS = [
//   "High-speed Wi-Fi",
//   "Air Conditioning",
//   "Attached Bathroom",
//   "Shared Kitchen",
//   "Washing Machine",
//   "Refrigerator",
//   "Generator Backup",
//   "24/7 Security",
//   "CCTV Surveillance",
//   "Balcony",
//   "Elevator",
//   "Dining Space"
// ];

// const NEIGHBORHOOD_OPTIONS = [
//   { value: "Rupnagar Abashik", label: "Rupnagar Abashik" },
//   { value: "itb-bandung", label: "ITB Bandung" },
//   { value: "coblong", label: "Coblong" },
//   { value: "all-city", label: "All City" }
// ];

// export default function AddProperty() {
//   const router = useRouter();
//   const { isPending: sessionPending } = authClient.useSession();
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);
  
//   // Form State
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [location, setLocation] = useState("");
//   const [neighborhood, setNeighborhood] = useState("Rupnagar Abashik");
//   const [type, setType] = useState("Private Room");
//   const [targetAudience, setTargetAudience] = useState("bachelor");
//   const [desc, setDesc] = useState("");
//   const [fullDescription, setFullDescription] = useState("");
//   const [image, setImage] = useState("");
//   const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
//   const [customAmenity, setCustomAmenity] = useState("");

//   // Retrieve auth token
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

//   // Image upload
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("image", file);

//     const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || "d216503c14d9b736746ef7414dfa4f00"; // fallback if env is blank

//     try {
//       const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//         method: "POST",
//         body: formData
//       });
//       const data = await response.json();
//       if (data.success) {
//         setImage(data.data.url);
//         toast.success("Property photo uploaded successfully!");
//       } else {
//         toast.error("Failed to upload image to ImgBB");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Image upload request failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Amenities toggle
//   const toggleAmenity = (name: string) => {
//     if (selectedAmenities.includes(name)) {
//       setSelectedAmenities(selectedAmenities.filter(item => item !== name));
//     } else {
//       setSelectedAmenities([...selectedAmenities, name]);
//     }
//   };

//   // Add custom amenity
//   const addCustomAmenity = () => {
//     const trimmed = customAmenity.trim();
//     if (trimmed && !selectedAmenities.includes(trimmed)) {
//       setSelectedAmenities([...selectedAmenities, trimmed]);
//       setCustomAmenity("");
//     }
//   };

//   // Form Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!image) {
//       toast.warning("Please upload a property display photo before listing");
//       return;
//     }

//     setSaving(true);
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      
//       const neighborhoodLabel = NEIGHBORHOOD_OPTIONS.find(o => o.value === neighborhood)?.label || neighborhood;

//       const payload = {
//         title,
//         price: Number(price),
//         location,
//         neighborhood,
//         neighborhoodLabel,
//         type,
//         targetAudience,
//         desc,
//         fullDescription,
//         image,
//         amenities: selectedAmenities
//       };

//       const response = await fetch(`${baseUrl}/api/v1/landlord/properties`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       if (result.success) {
//         toast.success("Flat listed successfully!");
//         router.push("/landlord/properties");
//         router.refresh();
//       } else {
//         toast.error(result.message || "Failed to create property");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error submitting property listing");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (sessionPending) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
//         <div className="w-10 h-10 border-4 border-t-[#f15a14] border-gray-100 rounded-full animate-spin" />
//         <span className="text-xs text-gray-400 font-semibold">Resolving session identity...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
//       {/* Title */}
//       <div>
//         <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">List New Property</h1>
//         <p className="text-xs text-gray-400 mt-1">Submit flat location specifics, monthly price ranges, and photorealistic views.</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm">
        
//         {/* Core details */}
//         <div className="space-y-5">
//           <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
//             <Building className="w-4 h-4 text-[#f15a14]" /> General Information
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Property Title</label>
//               <input 
//                 type="text" 
//                 placeholder="e.g. Skyline Cozy Master Suite"
//                 value={title}
//                 onChange={e => setTitle(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Price (TK)</label>
//               <input 
//                 type="number" 
//                 placeholder="Monthly rate in TK"
//                 value={price}
//                 onChange={e => setPrice(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Property Type</label>
//               <select 
//                 value={type}
//                 onChange={e => setType(e.target.value)}
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
//               >
//                 <option value="Private Room">Private Room</option>
//                 <option value="Entire Flat">Entire Flat</option>
//                 <option value="Shared Co-Living">Shared Co-Living</option>
//               </select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Target Tenant Audience</label>
//               <select 
//                 value={targetAudience}
//                 onChange={e => setTargetAudience(e.target.value)}
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
//               >
//                 <option value="bachelor">Bachelor (Student/Job Holder)</option>
//                 <option value="family">Family Units</option>
//               </select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Neighborhood Area</label>
//               <select 
//                 value={neighborhood}
//                 onChange={e => setNeighborhood(e.target.value)}
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
//               >
//                 {NEIGHBORHOOD_OPTIONS.map(opt => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Full Location Address</label>
//               <input 
//                 type="text" 
//                 placeholder="e.g. Rupnagar R/A, Road 14, House 5, Mirpur"
//                 value={location}
//                 onChange={e => setLocation(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Image Uploader */}
//         <div className="space-y-4">
//           <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
//             Property Display Media
//           </h3>
//           <div className="flex flex-col sm:flex-row items-center gap-6">
//             <label className="w-full sm:w-48 h-36 border-2 border-dashed border-gray-300 hover:border-[#f15a14] bg-gray-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group">
//               <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//               {image ? (
//                 <Image src={image} alt="Upload preview" fill className="object-cover" />
//               ) : (
//                 <div className="text-center p-4">
//                   <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-[#f15a14] transition-colors" />
//                   <span className="text-[10px] font-bold text-gray-500">
//                     {uploading ? "Uploading..." : "Upload Cover Photo"}
//                   </span>
//                 </div>
//               )}
//             </label>
//             <div className="flex-1 space-y-1.5 text-center sm:text-left">
//               <h4 className="text-xs font-bold text-gray-950">Upload Flat Images</h4>
//               <p className="text-[10px] text-gray-400 leading-relaxed max-w-sm">
//                 Add an appealing listing photo. Max size limits 5MB.
//               </p>
//               {image && (
//                 <button 
//                   type="button" 
//                   onClick={() => setImage("")}
//                   className="mt-2 text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1 mx-auto sm:mx-0"
//                 >
//                   <X className="w-3 h-3" /> Remove image
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Descriptions */}
//         <div className="space-y-4">
//           <h3 className="text-sm font-bold text-gray-950 pb-2 border-b border-gray-50">Descriptions</h3>
//           <div className="space-y-4">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description (Summary)</label>
//               <textarea 
//                 rows={2}
//                 placeholder="Give a quick, captivating sentence describing this property..."
//                 value={desc}
//                 onChange={e => setDesc(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-[10px] font-bold text-gray-400 uppercase">Detailed Description</label>
//               <textarea 
//                 rows={4}
//                 placeholder="Describe room features, common area spaces, utilities billing info, public transit proximity..."
//                 value={fullDescription}
//                 onChange={e => setFullDescription(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Amenities Selection */}
//         <div className="space-y-4">
//           <h3 className="text-sm font-bold text-gray-950 pb-2 border-b border-gray-50">Select Flat Amenities</h3>
          
//           <div className="flex flex-wrap gap-2">
//             {AMENITY_OPTIONS.map((amenity) => {
//               const isSelected = selectedAmenities.includes(amenity);
//               return (
//                 <button
//                   type="button"
//                   key={amenity}
//                   onClick={() => toggleAmenity(amenity)}
//                   className={`px-3.5 py-2 rounded-full border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
//                     isSelected
//                       ? "bg-black border-black text-white shadow-sm"
//                       : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
//                   }`}
//                 >
//                   {isSelected && <Check className="w-3.5 h-3.5" />}
//                   {amenity}
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex gap-2 max-w-sm pt-2">
//             <input 
//               type="text" 
//               placeholder="e.g. Rooftop Access"
//               value={customAmenity}
//               onChange={e => setCustomAmenity(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
//               className="flex-1 px-4 py-2.5 rounded-xl border border-gray-150 text-xs focus:border-[#f15a14] focus:outline-none"
//             />
//             <Button
//               type="button"
//               onClick={addCustomAmenity}
//               className="bg-black hover:bg-zinc-800 text-white rounded-xl px-4 text-xs font-bold"
//             >
//               Add custom
//             </Button>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
//           <Button 
//             type="button" 
//             variant="outline" 
//             onClick={() => router.back()} 
//             className="rounded-xl text-xs h-11 px-6"
//           >
//             Cancel
//           </Button>
//           <Button 
//             type="submit" 
//             disabled={saving || uploading}
//             className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-11 px-6 shadow-md shadow-orange-500/20"
//           >
//             {saving ? "Creating Listing..." : "Publish Listing"}
//           </Button>
//         </div>

//       </form>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { X, Check, Building, Plus, Minus } from "lucide-react";
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

export default function AddProperty() {
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
  const type = "Entire Flat";
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

  // Room details (when Entire Flat)
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [balconies, setBalconies] = useState(0);
  const [kitchens, setKitchens] = useState(1);
  const [hasDiningSpace, setHasDiningSpace] = useState(true);

  // Occupancy & Rules
  const [minPerson, setMinPerson] = useState(1);
  const [maxPerson, setMaxPerson] = useState(4);
  const [condition, setCondition] = useState("well_maintained");
  const [gateClosingTime, setGateClosingTime] = useState("11:00 PM");



  // Multiple Images upload via external ImgBB API
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

  // Add custom amenity
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
        roomDetails: {
          bedrooms,
          bathrooms,
          balconies,
          kitchens,
          hasDiningSpace
        },
        occupancyLimits: {
          minPerson,
          maxPerson
        },
        condition,
        gateClosingTime,
        roomSpecs: undefined
      };

      // Perform POST call using your application's serverMutation helper
      console.log(payload)
      const result = await serverMutation(`/api/v1/landlord/properties/${user?.id}`, payload, "POST");

      if (result?.success || result) {
        toast.success("Your listing has been submitted and is awaiting Admin Approval.");
        router.push("/landlord/properties");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to create property");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Network error submitting property listing");
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
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">List New Property</h1>
        <p className="text-xs text-gray-400 mt-1">Submit flat location specifics, monthly price ranges, and photos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Core details */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
            <Building className="w-4 h-4 text-[#f15a14]" /> General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Property Title</label>
              <input 
                type="text" 
                placeholder="e.g. Skyline Cozy Master Suite"
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

        {/* Section 2: Conditional Room Specifications */}
        <div className="space-y-5 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Property Layout & Specifications</h3>

            <div className="space-y-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Entire Flat Composition</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Bedrooms", val: bedrooms, set: setBedrooms, min: 1 },
                  { label: "Bathrooms", val: bathrooms, set: setBathrooms, min: 1 },
                  { label: "Balconies", val: balconies, set: setBalconies, min: 0 },
                  { label: "Kitchens", val: kitchens, set: setKitchens, min: 1 }
                ].map(item => (
                  <div key={item.label} className="p-3 border border-gray-150 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 gap-2">
                    <span className="text-[10px] font-extrabold text-gray-500 uppercase">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => item.set(Math.max(item.min, item.val - 1))}
                        className="w-7 h-7 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-150 bg-white"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="text-xs font-black text-gray-950">{item.val}</span>
                      <button
                        type="button"
                        onClick={() => item.set(item.val + 1)}
                        className="w-7 h-7 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-150 bg-white"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setHasDiningSpace(!hasDiningSpace)}
                  className={`w-10 h-6 rounded-full transition-colors relative outline-none ${
                    hasDiningSpace ? "bg-[#f15a14]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      hasDiningSpace ? "right-1" : "left-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-gray-700">Dedicated Dining Space Available</span>
              </div>
            </div>
        </div>

        {/* Section 3: Property Details & Rules */}
        <div className="space-y-5 pt-4 border-t border-gray-50">
          <h3 className="text-sm font-bold text-gray-950">Property Details & Rules</h3>
          
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
              <label className="text-[10px] font-bold text-gray-400 uppercase">Property Condition</label>
              <select 
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
              >
                <option value="brand_new">Brand New</option>
                <option value="recently_renovated">Recently Renovated</option>
                <option value="well_maintained">Well Maintained</option>
                <option value="old">Old</option>
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
                <option value="12:00 AM">12:00 AM</option>
                <option value="Flexible/No Gate Restriction">Flexible/No Gate Restriction</option>
              </select>
            </div>
          </div>
        </div>

        {/* Image Uploader (Multiple) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-950">Property Display Media</h3>
            <span className="text-[10px] font-semibold text-gray-400">{images.length} photo(s) selected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                <Image src={imgUrl} alt={`Property view ${index + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-[#f15a14] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Cover
                  </span>
                )}
              </div>
            ))}

            <label className="aspect-square border-2 border-dashed border-gray-300 hover:border-[#f15a14] bg-gray-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={uploading}
              />
              {uploading ? (
                <div className="w-5 h-5 border-2 border-t-[#f15a14] border-gray-200 rounded-full animate-spin" />
              ) : (
                <div className="text-center p-2">
                  <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1 group-hover:text-[#f15a14] transition-colors" />
                  <span className="text-[10px] font-bold text-gray-500">
                    {images.length > 0 ? "Add More" : "Upload Photos"}
                  </span>
                </div>
              )}
            </label>
          </div>
          <p className="text-[10px] text-gray-400">
            First uploaded photo serves as the primary cover photo. Select multiple files to upload at once.
          </p>
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-950 pb-2 border-b border-gray-50">Descriptions</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description (Summary)</label>
              <textarea 
                rows={2}
                placeholder="Give a quick, captivating sentence describing this property..."
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
                placeholder="Describe room features, common area spaces, utilities billing info, public transit proximity..."
                value={fullDescription}
                onChange={e => setFullDescription(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-950 pb-2 border-b border-gray-50">Select Flat Amenities</h3>
          
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
              placeholder="e.g. Rooftop Access"
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
            {saving ? "Creating Listing..." : "Publish Listing"}
          </Button>
        </div>

      </form>
    </div>
  );
}