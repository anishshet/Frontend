import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResendOTP, setShowResendOTP] = useState(false);


  useEffect(() => {
    if (otpSent) {
      const timer = setTimeout(() => {
        setShowResendOTP(true);
      }, 30000); // Show "Resend OTP" after 30 seconds

      return () => clearTimeout(timer);
    }
  }, [otpSent]);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    return name.substring(0, 3) + "**@" + domain;
  };

  // STEP 1: Send OTP by Deleting Existing Password
  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await axios.delete(`/api/user/${email}/password`);
      setMessage(`OTP has been sent to your email (${maskEmail(email)})`);
      setOtpSent(true);
      setShowResendOTP(false); // Hide the resend OTP link initially
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Function to handle resend OTP
  const handleResendOTP = async () => {
    setError("");
    setMessage("");

    try {
      await axios.delete(`/api/user/${email}/password`);
      setMessage(`OTP has been resent to your email (${maskEmail(email)})`);
      setShowResendOTP(false);
      setTimeout(() => setShowResendOTP(true), 30000); // Show "Resend OTP" after 30 sec
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  // STEP 2: Enter OTP + Reset Password
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp) {
      setError("Please enter the OTP received on your email.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.put(`/api/user/${email}/password`, {
        prooftype: "otp",
        proof: otp,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      });

      setMessage("Password reset successfully! You can now log in.");
      setOtpSent(false); // Reset the form
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gray-900 text-gray-500">
      <h1 className="text-white text-xl font-medium mb-2">
        {!otpSent ? "Forgot Password?" : "Enter OTP & Reset Password"}
      </h1>
      <p className="text-gray-400 text-sm mb-4">
        {!otpSent
          ? "Enter your email to receive an OTP."
          : "Enter the OTP sent to your email and reset your password."}
      </p>

      {message && <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm">{message}</div>}
      {error && <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {/* Step 1: Enter Email */}
      {!otpSent && (
        <form onSubmit={handleSendOTP} className="flex flex-col gap-4 w-[min(300px,90vw)] mt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none placeholder-gray-400"
            placeholder="Email address"
            required
          />
          <button type="submit" className="p-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition">
            Send OTP
          </button>
        </form>
      )}

      {/* Step 2: Enter OTP + New Password in One Step */}
      {otpSent && (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4 w-[min(300px,90vw)] mt-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none placeholder-gray-400"
            placeholder="Enter OTP"
            required
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none placeholder-gray-400"
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 rounded-lg bg-gray-800 border border-gray-500 text-white outline-none placeholder-gray-400"
            placeholder="Confirm Password"
            required
          />
          <button type="submit" className="p-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition">
            Reset Password
          </button>

          {showResendOTP && (
            <p className="text-sm text-blue-400 hover:text-blue-300 transition mt-2 cursor-pointer" onClick={handleResendOTP}>
              Resend OTP
            </p>
          )}
        </form>
      )}

      <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300 transition mt-4">
        Back to Sign In
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;