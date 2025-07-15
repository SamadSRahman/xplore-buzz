import React, { useState, useEffect } from "react";
import { Copy, Download, Share2, X, ExternalLink, Check } from "lucide-react";

const QRPopup = ({ isOpen, onClose, qrCodeUrl, previewUrl, linkToCopy }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "QR Code",
          text: "Check out this QR code",
          url: linkToCopy,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-lg transform transition-all duration-300 ease-out ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={() => {
          if (!isOpen) setIsVisible(false);
        }}
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-0.5">
            <div className="h-full w-full bg-white dark:bg-gray-900 rounded-2xl" />
          </div>
          <div className="relative p-8">
            {/* Top corner close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                QR Code
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Scan or share this QR code
              </p>
            </div>

            <div className="relative mb-8 flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 animate-pulse" />
              </div>
              <div className="relative z-10 p-6 bg-white rounded-2xl shadow-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Link:
              </p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                {linkToCopy}
              </p>
            </div>

            <div className="flex justify-center flex-wrap gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none"
                title={copied ? "Copied!" : "Copy link"}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none"
                title="Download QR code"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none"
                title="Share QR code"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {previewUrl && (
                <button
                  onClick={handlePreview}
                  className="flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none"
                  title="Open preview"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPopup;
