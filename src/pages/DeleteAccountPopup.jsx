import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function DeleteAccountPopup({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAccount } = useAuth();

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      const result = await deleteAccount();
      console.log("Delete success:", result);

      setIsDeleting(false);
      setConfirmText("");
      alert("Account deleted successfully.");
      onClose(); // close after success
    } catch (err) {
      console.error("Deletion failed:", err);
      alert(err.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setConfirmText("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Account
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-red-600 font-medium mb-3">
              This action cannot be undone
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Deleting your account will permanently remove:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Your profile and personal information</li>
              <li>• All your posts and comments</li>
              <li>• Your account history and settings</li>
              <li>• Any uploaded files or media</li>
            </ul>
            <p className="text-sm text-gray-600">
              This data cannot be recovered once deleted.
            </p>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                DELETE
              </span>{" "}
              to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Type DELETE here"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || isDeleting}
              className={`flex-1 font-medium py-2 px-4 rounded-md transition-colors ${
                confirmText === "DELETE" && !isDeleting
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
