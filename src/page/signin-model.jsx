"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AuthSingup, ResendOTP, verifyOtp } from "@/services/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setUser } from "@/feature/user-slice";

const SignupPageModel = ({ closeModal }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    user_name: "",
    email: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const modalRef = useRef(null);

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // -------------------
  // HANDLE SIGNUP
  // -------------------
  const handleSignup = async () => {
    try {
      if (!form.user_name.trim() || !form.email.trim()) {
        toast.error("Please fill all fields");
        return;
      }

      setLoading(true);
      const res = await AuthSingup(form);

      if (res) {
        toast.success("OTP sent successfully");
        setStep(2);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------
  // HANDLE OTP INPUT
  // -------------------
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // -------------------
  // VERIFY OTP
  // -------------------
  const handleVerifyOtp = async () => {
    try {
      const finalOtp = otp.join("");

      if (finalOtp.length < 4) {
        toast.error("Please enter full OTP");
        return;
      }

      setOtpLoading(true);

      const res = await verifyOtp({
        email: form.email,
        otp: finalOtp,
      });

      if (res) {
        toast.success("OTP Verified");
        // Close modal after success
        dispatch(setUser(res?.data));
        dispatch(setIsAuthenticated(true));
        closeModal();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------
  // RESEND OTP
  // -------------------
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const res = await ResendOTP(form.email);

      if (res) toast.success("OTP resent");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* CLOSE BUTTON */}
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-white text-2xl font-bold hover:text-gray-300"
      >
        ✕
      </button>

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-purple-100 relative"
      >
        {/* STEP 1 — SIGNUP */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center text-purple-700">
              Login / Signup
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Enter your details to continue
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.user_name}
                onChange={(e) =>
                  setForm({ ...form, user_name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-300 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-300 outline-none"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 mt-6 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </motion.button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-center text-purple-700">
              Verify OTP
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Code sent to <span className="font-medium">{form.email}</span>
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  maxLength={1}
                  value={otp[i]}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-14 border border-purple-200 rounded-xl text-center text-2xl font-bold text-purple-600 focus:ring-2 focus:ring-purple-300 outline-none"
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-60"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </motion.button>

            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="w-full mt-3 text-purple-600 font-semibold hover:text-purple-800 transition disabled:opacity-60"
            >
              {resendLoading ? "Sending again..." : "Resend OTP"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SignupPageModel;
