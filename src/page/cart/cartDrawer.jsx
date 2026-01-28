import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "@/feature/addtocart_slice";
import {
  addTocart,
  getuserCartItems,
  removeFromCartApi,
} from "@/services/cart";
import { toast } from "react-toastify";
import AddressModal from "../address/addressModel";
import {
  getAddress,
  PostSelectedAddress,
} from "@/services/address/postaddress";
import { MapPin, ChevronDown } from "lucide-react";

export default function CartDrawer({ open, close }) {
  const dispatch = useDispatch();
  const [cartsItemsList, setCartsItemsList] = useState([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [refreshState, setRefreshState] = useState(false);

  // 🔁 Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await getuserCartItems();
      setCartsItemsList(res?._payload?.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔒 Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // ⌨️ ESC close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [close]);

  // ➕ Increase
  const handleIncrease = async (item) => {
    try {
      dispatch(increaseQuantity({ product: item.product._id }));
      await addTocart({
        items: {
          product: item.product._id,
          quantity: item.quantity + 1,
        },
      });
      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // ➖ Decrease / Remove
  const handleDecrease = async (item) => {
    try {
      if (item.quantity === 1) {
        dispatch(decreaseQuantity({ product: item.product._id }));
        await removeFromCartApi({ product: item.product._id });
        toast.success("Item removed");
      } else {
        dispatch(decreaseQuantity({ product: item.product._id }));
        await addTocart({
          items: {
            product: item.product._id,
            quantity: item.quantity - 1,
          },
        });
      }
      fetchCart();
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // 💰 Total

  const totalAmount = useMemo(() => {
    return cartsItemsList.reduce(
      (sum, item) => sum + item.product.product_price * item.quantity,
      0,
    );
  }, [cartsItemsList]);

  useEffect(() => {
    const SelectedAddres = async () => {
      try {
        const res = await getAddress();

        const selected = res?.addresses?.find(
          (address) => address?.selected_address === true,
        );
        if (selected) {
          setSelectedAddress(selected);
        }
      } catch (error) {
        console.error("Error fetching selected address:", error);
      }
    };
    SelectedAddres();
  }, [selectedAddress, refreshState]);

  const selectedAddressSubmit = async (address) => {
    try {
      await PostSelectedAddress(address._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] bg-white
        flex flex-col
        shadow-[-4px_0_20px_rgba(0,0,0,0.2)]
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header (Sticky) */}
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b flex items-center justify-between">
          {selectedAddress ? (
            <div
              onClick={() => setAddressModalOpen(true)}
              className="flex items-start gap-2 cursor-pointer"
            >
              {/* Location Icon */}
              <MapPin size={18} className="text-pink-600 mt-1" />

              {/* Address Text */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  Delivering to
                  <ChevronDown size={14} />
                </span>

                <span className="text-sm font-semibold truncate max-w-[260px]">
                  {selectedAddress.address_type || "Other"} –{" "}
                  {selectedAddress.delivery_address}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-lg font-semibold">My Cart</span>
          )}

          {/* Close button stays same */}
          <button
            onClick={close}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {cartsItemsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            cartsItemsList.map((item) => {
              const { product, quantity } = item;
              const image = product.product_images?.[0]?.image_link;

              return (
                <div
                  key={product._id}
                  className="flex items-start gap-3 border-b pb-4"
                >
                  <img
                    src={image}
                    alt={product.product_name}
                    className="w-16 h-16 rounded-lg border object-contain"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹{product.product_price}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-1 text-lg hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-3 py-1 text-lg hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-semibold whitespace-nowrap">
                    ₹{product.product_price * quantity}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Bill Summary */}
        <div className="w-[95%] max-w-sm mx-auto bg-white border rounded-xl overflow-hidden shadow-sm mb-5">
          {/* Header */}
          <div className="px-4 py-3 border-b font-semibold">Bill summary</div>

          {/* Bill details */}
          <div className="px-4 py-3 text-sm space-y-2">
            {/* Item Total */}
            <div className="flex justify-between text-gray-700">
              <span>Item total</span>
              <span>
                <span className="line-through text-gray-400 mr-1">₹525</span>₹
                {totalAmount}
              </span>
            </div>

            {/* Handling Fee */}
            <div className="flex justify-between text-gray-700">
              <span>Handling fee</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between text-gray-700">
              <span>Delivery fee</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
          </div>

          {/* To Pay */}
          <div className="px-4 py-3 border-t flex justify-between font-semibold text-base">
            <span>To Pay</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Footer (Sticky) */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-4">
          <button
            onClick={() => setAddressModalOpen(true)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white
  py-3 rounded-xl font-semibold text-base transition"
          >
            {selectedAddress
              ? `Proceed to Pay ₹${totalAmount}`
              : "Add Address to proceed"}
          </button>
        </div>
      </div>
      {addressModalOpen && (
        <AddressModal
          isOpen={addressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          onSelect={(address) => {
            setSelectedAddress(address);
            setAddressModalOpen(false);
            selectedAddressSubmit(address);
            toast.success("Address selected");
          }}
          setRefreshState={setRefreshState}
        />
      )}
    </>
  );
}
