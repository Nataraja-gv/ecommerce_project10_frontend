import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { MapPin, ChevronDown, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createAOrder } from "@/services/order/order";

export default function CartDrawer({ open, close }) {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refershState, setRefreshState] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getuserCartItems();
      setItems(res?._payload?.items || []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [close]);

  const handleIncrease = async (item) => {
    dispatch(increaseQuantity({ product: item.product._id }));
    await addTocart({
      items: { product: item.product._id, quantity: item.quantity + 1 },
    });
    fetchCart();
  };

  const handleDecrease = async (item) => {
    dispatch(decreaseQuantity({ product: item.product._id }));
    if (item.quantity === 1) {
      await removeFromCartApi({ product: item.product._id });
      toast.success("Item removed");
    } else {
      await addTocart({
        items: { product: item.product._id, quantity: item.quantity - 1 },
      });
    }
    fetchCart();
  };

  const totalAmount = useMemo(
    () => items.reduce((s, i) => s + i.product.product_price * i.quantity, 0),
    [items],
  );

  useEffect(() => {
    (async () => {
      const res = await getAddress();
      const selected = res?.addresses?.find((a) => a.selected_address);
      if (selected) setSelectedAddress(selected);
    })();
  }, [refershState]);

  const totalMrpAmountAllItems = items?.reduce((arr, item) => {
    return arr + item.product.mrp * item.quantity;
  }, 0);

  const handleSubmitOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    try {
      const orderPayload = {
        address_details: selectedAddress._id,
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      };
      const res = await createAOrder(orderPayload);
      if (res) {
        toast.success("Order placed successfully");
        close();
      }
    } catch (error) {
      toast.error(error?.message || "Failed to place order");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-white flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-4 flex justify-between items-center">
              {selectedAddress ? (
                <button
                  onClick={() => setAddressModalOpen(true)}
                  className="flex gap-2 items-start text-left cursor-pointer"
                >
                  <MapPin className="text-pink-600 mt-1" size={18} />
                  <div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      Delivering to <ChevronDown size={14} />
                    </div>
                    <div className="text-sm font-semibold truncate max-w-[260px]">
                      {selectedAddress?.address_type} –{" "}
                      {selectedAddress?.delivery_address}
                    </div>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2 font-semibold">
                  <ShoppingCart size={18} /> My Cart
                </div>
              )}

              <button
                onClick={close}
                className="rounded-full p-2 hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {loading && (
                <div className="text-center text-sm text-gray-400">
                  Loading cart…
                </div>
              )}

              {!loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                  <ShoppingCart size={48} className="mb-3 opacity-40" />
                  <p>Your cart is empty</p>
                </div>
              )}

              {items.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  className="flex gap-3 border-b pb-4"
                >
                  <img
                    src={item.product.product_images?.[0]?.image_link}
                    alt={item.product.product_name}
                    className="w-16 h-16 rounded-xl border object-contain"
                  />

                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.product.product_name}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-xs text-gray-500 line-through">
                        ₹{item?.product?.mrp}{" "}
                      </p>
                      <p className="text-xs text-black">
                        ₹{item.product.product_price}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="px-3 py-1 cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="px-3 py-1 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="font-semibold text-sm">
                    ₹{item.product.product_price * item.quantity}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bill */}
            {items.length > 0 && (
              <div className="mx-4 mb-4 border rounded-xl overflow-hidden">
                <div className="px-4 py-3 font-semibold border-b">
                  Bill summary
                </div>
                <div className="px-4 py-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Item total</span>
                    <div>
                      <span className=" text-gray-300 line-through">
                        {" "}
                        ₹{totalMrpAmountAllItems}
                      </span>
                      <span> ₹{totalAmount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Delivery</span>
                    <span>FREE</span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t font-semibold flex justify-between">
                  <span>To Pay</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="sticky bottom-0 border-t bg-white px-4 py-4">
              <button className="w-full rounded-xl bg-pink-600 py-3 text-white font-semibold hover:bg-pink-700 cursor-pointer">
                {selectedAddress ? (
                  <span
                    // onClick={handleSubmitOrder}
                    onClick={() => {
                      if (!selectedAddress) return setAddressModalOpen(true);
                      setPaymentModalOpen(true);
                    }}
                  >
                    Proceed to Pay ₹{totalAmount}
                  </span>
                ) : (
                  <span onClick={() => setAddressModalOpen(true)}>
                    Add Address to proceed
                  </span>
                )}
              </button>
            </div>
          </motion.aside>

          {addressModalOpen && (
            <AddressModal
              isOpen={addressModalOpen}
              onClose={() => setAddressModalOpen(false)}
              onSelect={async (address) => {
                setSelectedAddress(address);
                await PostSelectedAddress(address._id);
                toast.success("Address selected");
                setAddressModalOpen(false);
              }}
              setRefreshState={setRefreshState}
            />
          )}
          {/* PAYMENT MODAL */}
          {/* PAYMENT MODAL */}
          {paymentModalOpen && (
            <motion.div
              className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 250 }}
                className="bg-white w-full sm:w-[460px] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
              >
                <h3 className="text-lg font-semibold mb-1">
                  Choose payment method
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select how you want to pay
                </p>

                {/* OPTIONS */}
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("COD")}
                    className={`w-full flex items-center justify-between border rounded-2xl px-4 py-3 cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? "border-pink-600 bg-pink-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">
                        Pay when item arrives
                      </p>
                    </div>
                    {paymentMethod === "COD" && (
                      <span className="text-pink-600 font-bold">✓</span>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`w-full flex items-center justify-between border rounded-2xl px-4 py-3  cursor-pointer transition ${
                      paymentMethod === "ONLINE"
                        ? "border-pink-600 bg-pink-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-medium">Online Payment</p>
                      <p className="text-xs text-gray-500">
                        UPI, Card, Netbanking
                      </p>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <span className="text-pink-600 font-bold">✓</span>
                    )}
                  </button>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                  <button
                    className="flex-1 border rounded-xl py-3 text-sm font-medium  cursor-pointer"
                    onClick={() => setPaymentModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!paymentMethod}
                    className="flex-1 rounded-xl py-3 text-sm font-semibold text-white bg-pink-600 disabled:opacity-50  cursor-pointer"
                    onClick={handleSubmitOrder}
                  >
                    Place Order
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
