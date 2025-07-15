// import React, { useState } from "react";
// import { Eye, EyeOff, X, Lock } from "lucide-react";
// import useAuth from "../hooks/useAuth.js";

// export default function PasswordChangePopup({ open, onClose }) {
//   const { changePassword } = useAuth();
//   const [isOpen, setIsOpen] = useState(true);
//   const [formData, setFormData] = useState({
//     current_password: "",
//     new_password: "",
//     confirm_password: "",
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [field]: "",
//     }));
//     setServerError(""); // clear server error on new input
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const { current_password, new_password, confirm_password } = formData;

//     if (!current_password) {
//       newErrors.current_password = "Current password is required";
//     }

//     if (!new_password) {
//       newErrors.new_password = "New password is required";
//     } else if (new_password.length < 8) {
//       newErrors.new_password = "Password must be at least 8 characters";
//     } else if (new_password === current_password) {
//       newErrors.new_password =
//         "New password must be different from current password";
//     }

//     if (!confirm_password) {
//       newErrors.confirm_password = "Please confirm your new password";
//     } else if (new_password !== confirm_password) {
//       newErrors.confirm_password = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const { current_password, new_password } = formData;
//       const response = await changePassword(current_password, new_password);
//       console.log("Password change successful:", response);
//       alert("Password changed successfully!");
//       setIsOpen(false);
//       onClose(); // close popup
//     } catch (err) {
//       console.error("Password change failed:", err.message);
//       setServerError(err.message);
//     }
//   };

//   if (!open || !isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
//       <style jsx>{`
//         .hide-scrollbar {
//           scrollbar-width: none; /* Firefox */
//           -ms-overflow-style: none; /* Internet Explorer 10+ */
//         }
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none; /* WebKit */
//         }
//       `}</style>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto hide-scrollbar">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
//           <div className="flex items-center space-x-2 sm:space-x-3">
//             <div className="p-2 sm:p-2.5 bg-blue-500 rounded-xl shadow-lg">
//               <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             </div>
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
//               Change Password
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200"
//           >
//             <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
//           {/* Current Password */}
//           <div>
//             <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
//               Current Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPasswords.current ? "text" : "password"}
//                 value={formData.current_password}
//                 onChange={(e) =>
//                   handleInputChange("current_password", e.target.value)
//                 }
//                 className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base ${
//                   errors.current_password
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
//                 }`}
//                 placeholder="Enter current password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility("current")}
//                 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
//               >
//                 {showPasswords.current ? (
//                   <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
//                 ) : (
//                   <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//                 )}
//               </button>
//             </div>
//             {errors.current_password && (
//               <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 font-medium">
//                 {errors.current_password}
//               </p>
//             )}
//           </div>

//           {/* New Password */}
//           <div>
//             <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPasswords.new ? "text" : "password"}
//                 value={formData.new_password}
//                 onChange={(e) =>
//                   handleInputChange("new_password", e.target.value)
//                 }
//                 className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base ${
//                   errors.new_password
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
//                 }`}
//                 placeholder="Enter new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility("new")}
//                 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
//               >
//                 {showPasswords.new ? (
//                   <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
//                 ) : (
//                   <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//                 )}
//               </button>
//             </div>
//             {errors.new_password && (
//               <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 font-medium">
//                 {errors.new_password}
//               </p>
//             )}
//           </div>

//           {/* Confirm New Password */}
//           <div>
//             <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
//               Confirm New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPasswords.confirm ? "text" : "password"}
//                 value={formData.confirm_password}
//                 onChange={(e) =>
//                   handleInputChange("confirm_password", e.target.value)
//                 }
//                 className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base ${
//                   errors.confirm_password
//                     ? "border-red-400 bg-red-50"
//                     : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
//                 }`}
//                 placeholder="Confirm new password"
//               />
//               <button
//                 type="button"
//                 onClick={() => togglePasswordVisibility("confirm")}
//                 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
//               >
//                 {showPasswords.confirm ? (
//                   <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
//                 ) : (
//                   <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//                 )}
//               </button>
//             </div>
//             {errors.confirm_password && (
//               <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 font-medium">
//                 {errors.confirm_password}
//               </p>
//             )}
//           </div>

//           {/* Password Requirements */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-blue-100">
//             <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
//               Password Requirements:
//             </h4>
//             <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
//               <li className="flex items-center space-x-2">
//                 <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
//                 <span>At least 8 characters long</span>
//               </li>
//               <li className="flex items-center space-x-2">
//                 <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
//                 <span>Different from current password</span>
//               </li>
//               <li className="flex items-center space-x-2">
//                 <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
//                 <span>Mix of letters, numbers, and symbols recommended</span>
//               </li>
//             </ul>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm sm:text-base"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
//             >
//               Change Password
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Eye, EyeOff, X, Lock } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

export default function PasswordChangePopup({ open, onClose }) {
  const { changePassword } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
    setServerError(""); // clear server error on new input
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { current_password, new_password } = formData;

    if (!current_password) {
      newErrors.current_password = "Current password is required";
    }

    if (!new_password) {
      newErrors.new_password = "New password is required";
    } else if (new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    } else if (new_password === current_password) {
      newErrors.new_password =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { current_password, new_password } = formData;
      const response = await changePassword(current_password, new_password);
      console.log("Password change successful:", response);
      alert("Password changed successfully!");
      setIsOpen(false);
      onClose(); // close popup
    } catch (err) {
      console.error("Password change failed:", err.message);
      setServerError(err.message);
    }
  };

  if (!open || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100 max-h-[95vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-2.5 bg-blue-500 rounded-xl shadow-lg">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-all duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.current_password}
                onChange={(e) =>
                  handleInputChange("current_password", e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base ${
                  errors.current_password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 font-medium">
                {errors.current_password}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.new_password}
                onChange={(e) =>
                  handleInputChange("new_password", e.target.value)
                }
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 sm:pr-12 transition-all duration-200 text-sm sm:text-base ${
                  errors.new_password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50 focus:bg-white"
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            {errors.new_password && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600 font-medium">
                {errors.new_password}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-5 rounded-xl border border-blue-100">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Password Requirements:
            </h4>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>At least 8 characters long</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>Different from current password</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>Mix of letters, numbers, and symbols recommended</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
