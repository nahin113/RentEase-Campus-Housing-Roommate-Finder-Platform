"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  location: string
  neighborhood: string
}

export default function Map({ location, neighborhood }: MapProps) {
  // Determine coordinates based on neighborhood / location
  let position: [number, number] = [23.8103, 90.4125] // Default Dhaka

  const lowerLocation = (location + " " + neighborhood).toLowerCase()
  if (lowerLocation.includes("rupnagar")) {
    position = [23.8188, 90.3562] // Rupnagar Abashik, Dhaka
  } else if (lowerLocation.includes("bandung") || lowerLocation.includes("itb") || lowerLocation.includes("coblong")) {
    position = [-6.8915, 107.6107] // ITB / Bandung, Indonesia
  }

  // Create custom marker with brand accent #f15a14
  const customIcon = typeof window !== "undefined" ? L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-[#f15a14]/30 rounded-full animate-ping"></div>
        <div class="relative w-6 h-6 bg-[#f15a14] rounded-full border-2 border-white shadow-md flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }) : undefined

  return (
    <div className="w-full h-[350px] rounded-3xl overflow-hidden shadow-inner border border-gray-150 relative">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {customIcon && (
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className="text-xs font-bold text-gray-950 font-sans">
                <p className="font-black text-[#f15a14] mb-0.5">{neighborhood}</p>
                <p className="text-gray-600 font-medium">{location}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
