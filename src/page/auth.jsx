"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { AuthSingup, ResendOTP, verifyOtp } from "@/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [form, setForm] = useState({
    user_name: "",
    email: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  // ----------------------------------------------------
  // HANDLE SIGNUP
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // HANDLE OTP INPUT
  // ----------------------------------------------------
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move forward
    if (value && index < 3) inputRefs.current[index + 1].focus();

    // Auto verify when 4 digits typed
    if (newOtp.join("").length === 4) {
      handleVerifyOtp();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  // ----------------------------------------------------
  // VERIFY OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async () => {
    try {
      const finalOtp = otp.join("");

      // if (finalOtp.length !== 4) {
      //   toast.error("Please enter complete OTP");
      //   return;
      // }

      setOtpLoading(true);

      const res = await verifyOtp({
        email: form.email,
        otp: finalOtp,
      });

      if (res) {
        toast.success("OTP Verified");
        router.push("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ----------------------------------------------------
  // RESEND OTP
  // ----------------------------------------------------
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const res = await ResendOTP(form.email);

      if (res) toast.success("OTP resent successfully");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        {/* ----------------------------------------------------
            STEP 1 — SIGNUP FORM
        ---------------------------------------------------- */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Join our marketplace and start shopping!
            </p>

            <input
              type="text"
              placeholder="Full Name"
              value={form.user_name}
              className="w-full border rounded-lg px-4 py-3 mb-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-yellow-400 outline-none"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-yellow-400 py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </motion.button>
          </>
        )}

        {/* ----------------------------------------------------
            STEP 2 — OTP VERIFICATION
        ---------------------------------------------------- */}
        {step === 2 && (
          <>
            <h2 className="text-center text-2xl font-bold">Verify OTP</h2>
            <p className="text-center text-gray-500 mb-6">
              Enter the 4-digit code sent to:
              <span className="font-medium"> {form.email}</span>
            </p>

            {/* OTP Fields */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  maxLength={1}
                  value={otp[i]}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-14 h-14 border rounded-xl text-center text-2xl font-semibold focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              ))}
            </div>

            {/* Verify Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full bg-yellow-400 py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-60"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </motion.button>

            {/* Resend OTP */}
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="w-full mt-3 text-yellow-600 text-center font-semibold cursor-pointer disabled:opacity-60"
            >
              {resendLoading ? "Sending again..." : "Resend OTP"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SignupPage;
