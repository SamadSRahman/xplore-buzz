// import React, { useState, useEffect } from 'react';
// import { Copy, Download, Share2, X, ExternalLink, Check } from 'lucide-react';

// const QRPopup = ({ 
//   isOpen, 
//   onClose, 
//   qrCodeUrl, 
//   previewUrl, 
//   linkToCopy 
// }) => {
//   const [copied, setCopied] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Handle animations
//   useEffect(() => {
//     if (isOpen) {
//       setIsAnimating(true);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   // Handle escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
//     document.addEventListener('keydown', handleEscape);
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, [isOpen, onClose]);

//   // Copy to clipboard
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(linkToCopy);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };

//   // Download QR code
//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = qrCodeUrl;
//     link.download = 'qr-code.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Share functionality
//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: 'QR Code',
//           text: 'Check out this QR code',
//           url: linkToCopy
//         });
//       } catch (err) {
//         console.error('Error sharing:', err);
//       }
//     } else {
//       // Fallback to copy
//       handleCopy();
//     }
//   };

//   // Open preview
//   const handlePreview = () => {
//     if (previewUrl) {
//       window.open(previewUrl, '_blank', 'noopener,noreferrer');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       {/* Backdrop */}
//       <div 
//         className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
//           isAnimating ? 'opacity-100' : 'opacity-0'
//         }`}
//       />
      
//       {/* Modal */}
//       <div 
//         className={`relative w-full max-w-lg transform transition-all duration-300 ease-out ${
//           isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
//         }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Card */}
//         <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
//           {/* Gradient Border */}
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-0.5">
//             <div className="h-full w-full bg-white dark:bg-gray-900 rounded-2xl" />
//           </div>
          
//           {/* Content */}
//           <div className="relative p-8">
//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
//               aria-label="Close modal"
//             >
//               <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
//             </button>

//             {/* Header */}
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
//                 QR Code
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 text-sm">
//                 Scan or share this QR code
//               </p>
//             </div>

//             {/* QR Code Container */}
//             <div className="relative mb-8 flex justify-center">
//               {/* Animated Ring */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 animate-pulse" />
//               </div>
              
//               {/* Ping Animation */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 animate-ping" />
//               </div>
              
//               {/* QR Code */}
//               <div className="relative z-10 p-6 bg-white rounded-2xl shadow-lg">
//                 <img 
//                   src={qrCodeUrl} 
//                   alt="QR Code" 
//                   className="w-48 h-48 object-contain"
//                 />
//               </div>
//             </div>

//             {/* Link Display */}
//             <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Link:</p>
//               <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
//                 {linkToCopy}
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center gap-3">
//               {/* Copy Button */}
//               <button
//                 onClick={handleCopy}
//                 className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//                 title={copied ? "Copied!" : "Copy link"}
//               >
//                 {copied ? (
//                   <Check className="w-5 h-5" />
//                 ) : (
//                   <Copy className="w-5 h-5" />
//                 )}
//               </button>

//               {/* Download Button */}
//               <button
//                 onClick={handleDownload}
//                 className="flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//                 title="Download QR code"
//               >
//                 <Download className="w-5 h-5" />
//               </button>

//               {/* Share Button */}
//               <button
//                 onClick={handleShare}
//                 className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//                 title="Share QR code"
//               >
//                 <Share2 className="w-5 h-5" />
//               </button>

//               {/* Preview Button */}
//               {previewUrl && (
//                 <button
//                   onClick={handlePreview}
//                   className="flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
//                   title="Open preview"
//                 >
//                   <ExternalLink className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Demo Component
// const QRPopupDemo = () => {
//   const [isOpen, setIsOpen] = useState(false);
  
//   // Mock QR code data
//   const mockQRCodeUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPgogIDxnIGZpbGw9IiMwMDAiPgogICAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIi8+CiAgICA8cmVjdCB4PSIxMzAiIHk9IjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIvPgogICAgPHJlY3QgeD0iMCIgeT0iMTMwIiB3aWR0aD0iNzAiIGhlaWdodD0iNzAiLz4KICA8L2c+CiAgPHRleHQgeD0iMTAwIiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZmlsbD0iIzMzMyI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+";
//   const mockPreviewUrl = "https://example.com/preview";
//   const mockLinkToCopy = "https://example.com/my-awesome-link";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
//           QR Code Popup Demo
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mb-8">
//           Click the button below to open the QR code popup
//         </p>
//         <button
//           onClick={() => setIsOpen(true)}
//           className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
//         >
//           Open QR Code Popup
//         </button>
//       </div>
      
//       <QRPopup
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         qrCodeUrl={mockQRCodeUrl}
//         previewUrl={mockPreviewUrl}
//         linkToCopy={mockLinkToCopy}
//       />
//     </div>
//   );
// };

// export default QRPopupDemo;

// QRPopup.jsx
import React, { useState, useEffect } from 'react';
import { Copy, Download, Share2, X, ExternalLink, Check } from 'lucide-react';

const QRPopup = ({ 
  isOpen, 
  onClose, 
  qrCodeUrl, 
  previewUrl, 
  linkToCopy 
}) => {
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = qrCodeUrl;
//     link.download = 'qr-code.png';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

const handleDownload = async () => {
  try {
    const response = await fetch(qrCodeUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url); // Clean up
  } catch (err) {
    console.error('Failed to download QR code:', err);
  }
};



  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QR Code',
          text: 'Check out this QR code',
          url: linkToCopy
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div 
        className={`relative w-full max-w-lg transform transition-all duration-300 ease-out ${
          isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl p-0.5">
            <div className="h-full w-full bg-white dark:bg-gray-900 rounded-2xl" />
          </div>
          <div className="relative p-8">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 animate-ping" />
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Link:</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                {linkToCopy}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={handleCopy} className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900" title={copied ? "Copied!" : "Copy link"}>
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button onClick={handleDownload} className="flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900" title="Download QR code">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={handleShare} className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900" title="Share QR code">
                <Share2 className="w-5 h-5" />
              </button>
              {previewUrl && (
                <button onClick={handlePreview} className="flex items-center justify-center p-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900" title="Open preview">
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
