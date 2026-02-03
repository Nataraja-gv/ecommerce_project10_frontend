"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X, Plus, MapPin } from "lucide-react";
import { addAddress, getAddress } from "@/services/address/postaddress";

// Dynamically import Leaflet map (SSR disabled)
const LeafletMap = dynamic(() => import("@/component/custom-ui/LeafletMap"), {
  ssr: false,
});

const defaultCenter = [12.9716, 77.5946]; // Bangalore

export default function AddressModal({
  isOpen,
  onClose,
  onSelect,
  setRefreshState,
}) {
  const [userAddressList, setUserAddressList] = useState([]);
  const [step, setStep] = useState("LIST");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [formData, setFormData] = useState({
    delivery_customer_name: "",
    delivery_phone_number: "",
    delivery_address: "",
  });

  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data?.display_name) {
        setSelectedAddress(data.display_name);
        setFormData((prev) => ({
          ...prev,
          delivery_address: data.display_name,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch address:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAddress().then((res) => setUserAddressList(res?.addresses || []));
      setStep("LIST");
      setSelectedLocation(null);
      setSelectedAddress("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAddress = async () => {
    if (!selectedLocation) {
      alert("Please select location on map");
      return;
    }

    const payload = {
      delivery_customer_name: formData.delivery_customer_name,
      delivery_phone_number: formData.delivery_phone_number,
      delivery_address: formData.delivery_address,
      location: {
        type: "Point",
        coordinates: [
          selectedLocation[1], // longitude
          selectedLocation[0], // latitude
        ],
      },
    };

    const res = await addAddress(payload);
    if (res) {
      onClose();
      setRefreshState((prev) => !prev);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            {step === "LIST" && "Select an Address"}
            {step === "MAP" && "Select Location"}
            {step === "DETAILS" && "Add Address Details"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* LIST */}
        {step === "LIST" && (
          <>
            <div className="px-5 py-4">
              <button
                onClick={() => setStep("MAP")}
                className="flex w-full justify-between border-dashed border px-4 py-3 rounded-lg text-pink-600"
              >
                <div className="flex gap-2">
                  <Plus size={18} /> Add New Address
                </div>
                <span>{">"}</span>
              </button>
            </div>

            <div className="px-5 pb-5 space-y-4 max-h-[300px] overflow-y-auto">
              {userAddressList.map((addr) => (
                <button
                  key={addr._id}
                  onClick={() => {
                    onSelect(addr);
                    onClose();
                  }}
                  className="flex w-full gap-3 border-b pb-3 text-left"
                >
                  <MapPin size={18} className="text-pink-600 mt-1" />
                  <div>
                    <p className="font-medium">
                      {addr.delivery_customer_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {addr.delivery_address}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* MAP */}
        {step === "MAP" && (
          <div className="p-4 space-y-4">
            <LeafletMap
              center={defaultCenter}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              fetchAddressFromLatLng={fetchAddressFromLatLng}
            />

            {selectedAddress && (
              <div className="p-3 border rounded-lg text-sm bg-gray-50">
                📍 {selectedAddress}
              </div>
            )}

            <button
              disabled={!selectedLocation}
              onClick={() => setStep("DETAILS")}
              className="w-full bg-pink-600 disabled:bg-gray-300 text-white py-3 rounded-xl"
            >
              Confirm & Continue
            </button>
          </div>
        )}

        {/* DETAILS */}
        {step === "DETAILS" && (
          <div className="p-4 space-y-3">
            <input
              className="w-full border p-2 rounded"
              placeholder="Complete Address"
              value={formData.delivery_address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  delivery_address: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Receiver Name"
              value={formData.delivery_customer_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  delivery_customer_name: e.target.value,
                })
              }
            />

            <input
              className="w-full border p-2 rounded"
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={formData.delivery_phone_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  delivery_phone_number: e.target.value.replace(/\D/g, ""),
                })
              }
            />

            <button
              onClick={handleSaveAddress}
              className="w-full bg-pink-600 text-white py-3 rounded-xl"
            >
              Save Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
