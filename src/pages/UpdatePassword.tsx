// UpdatePassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
/*import { updatePasswordService, type UpdatePasswordPayload } from "../services/PasswordService.ts";*/


export function UpdatePassword(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [proof, setProof] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // For toggling password visibility
  const [showProof, setShowProof] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !proof || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    /*const payload: UpdatePasswordPayload = {
      email,
      prooftype: "password", // always using current password
      proof,
      newPassword,
      confirmNewPassword,
    };

    try {
      const data = await updatePasswordService(payload);
      console.log("Password update response:", data);
      setSuccess(true);
      // Optionally clear the fields after a successful update
      setEmail("");
      setProof("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }*/
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[rgb(107,114,128)] text-gray-500 rounded-lg">
      <h1 className="text-white text-2xl font-semibold mb-4">Update Password</h1>

      {success && (
        <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
          Password updated successfully.
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
          required
        />

        {/* Current Password Field */}
        <div className="relative">
          <input
            type={showProof ? "text" : "password"}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="Enter current password"
            className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowProof(!showProof)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showProof ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* New Password Field */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm New Password Field */}
        <div className="relative">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            className="p-3 rounded-lg bg-gray-800 border border-gray-600 text-white outline-none w-full placeholder-gray-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="p-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300"
        >
          Update Password
        </button>
      </form>

      <Link 
        to="/forgot-password" 
        className="block text-center mt-4 text-blue-300 hover:text-blue-400"
      >
        Forgot Password?
      </Link>
    </div>
  );
}
