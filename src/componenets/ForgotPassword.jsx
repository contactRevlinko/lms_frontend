import React, { useState } from "react";
import { Lock, Mail, X } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [openOtpPopup, setOpenOtpPopup] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Backend aavse pachi API call karvani
    toast.success("OTP sent successfully");
    setOpenOtpPopup(true);

    setEmail("");
  };

  const handleVerifyOtp = () => {
    if (otp !== "123456") {
      toast.error("Invalid OTP");
      return;
    }

    toast.success("OTP Verified");
    setOtpVerified(true);
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password Reset Successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <Mail className="text-indigo-600" size={30} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2">
          Enter your registered email address and we'll send a OTP to verify
          your identity.
        </p>

        <form onSubmit={handleSendOtp} className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all"
          >
            Send Verification OTP
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Back to Login
          </Link>
        </div>
      </div>

      {openOtpPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center  ">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 relative shadow-xl ">
            <button
              onClick={() => setOpenOtpPopup(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <Lock className="text-indigo-600" size={28} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-800">
              Verify OTP
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter the OTP sent to your email and create a new password.
            </p>

            {!otpVerified ? (
              <div className="mt-5">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl"
                >
                  Verify OTP
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3"
                />

                <button
                  onClick={handleResetPassword}
                  className="w-full bg-indigo-700 text-white py-3 rounded-xl"
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
