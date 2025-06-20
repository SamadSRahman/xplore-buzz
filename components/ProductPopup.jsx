// 'use client';

// import { motion } from 'framer-motion';
// import { ShoppingCart, X } from 'lucide-react';
// import { useEffect, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

// export default function ProductPopup({ annotation, onClose }) {
//   const getPositionClasses = (position) => {
//     switch (position) {
//       case 'top-left':
//         return 'top-4 left-4';
//       case 'top-right':
//         return 'top-4 right-4';
//       case 'bottom-left':
//         return 'bottom-4 left-4';
//       case 'bottom-right':
//         return 'bottom-4 right-4';
//       case 'center':
//         return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
//       default:
//         return 'bottom-4 right-4';
//     }
//   };

//   const handleBuyNow = () => {
//     if (annotation.url) {
//       window.open(annotation.url, '_blank');
//     }
//   };

//   // ✅ Convert file to blob URL once
//   const imageSrc = useMemo(() => {
//     return annotation.image && typeof annotation.image !== 'string'
//       ? URL.createObjectURL(annotation.image)
//       : annotation.image || null;
//   }, [annotation.image]);

//   // ✅ Cleanup to avoid memory leak
//   useEffect(() => {
//     return () => {
//       if (imageSrc && typeof annotation.image !== 'string') {
//         URL.revokeObjectURL(imageSrc);
//       }
//     };
//   }, [imageSrc, annotation.image]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.8, y: 20 }}
//       animate={{ opacity: 1, scale: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.8, y: 20 }}
//       className={`absolute ${getPositionClasses(annotation.position)} z-10 max-w-sm`}
//     >
//       <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
//         <CardContent className="p-4">
//           <div className="flex items-start space-x-3">
//             {/* Product Image */}
//             <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
//               {imageSrc ? (
//                 <img
//                   src={imageSrc}
//                   alt={annotation.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center">
//                   <ShoppingCart className="w-6 h-6 text-gray-400" />
//                 </div>
//               )}
//             </div>

//             {/* Product Info */}
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-gray-900 text-sm truncate">
//                 {annotation.name}
//               </h3>
//               <p className="text-xs text-gray-600 mt-1 line-clamp-2">
//                 {annotation.description || 'Premium quality product available now'}
//               </p>

//               <Button
//                 size="sm"
//                 onClick={handleBuyNow}
//                 className="mt-3 w-full text-xs h-8"
//                 style={{
//                   backgroundColor: annotation.backgroundColor,
//                   color: annotation.fontColor,
//                 }}
//               >
//                 Buy Now
//               </Button>
//             </div>

//             {/* Close Button */}
//             {onClose && (
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }


'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductPopup({ annotation, onClose }) {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (annotation.image) {
      if (typeof annotation.image === 'string') {
        // If it's already a string URL, use it directly
        setImageSrc(annotation.image);
      } else if (annotation.image instanceof File) {
        // If it's a File object, create a blob URL
        const blobUrl = URL.createObjectURL(annotation.image);
        setImageSrc(blobUrl);
        
        // Cleanup function to revoke the blob URL
        return () => {
          URL.revokeObjectURL(blobUrl);
        };
      }
    } else {
      setImageSrc(null);
    }
  }, [annotation.image]);

  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  const handleBuyNow = () => {
    if (annotation.url) {
      window.open(annotation.url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className={`absolute ${getPositionClasses(annotation.position)} z-10 max-w-sm`}
    >
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={annotation.name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', imageSrc);
                    // Fallback to placeholder if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full flex items-center justify-center ${imageSrc ? 'hidden' : 'flex'}`}
              >
                <ShoppingCart className="w-6 h-6 text-gray-400" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {annotation.name || 'Product'}
              </h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {annotation.description || 'Premium quality product available now'}
              </p>

              <Button
                size="sm"
                onClick={handleBuyNow}
                className="mt-3 w-full text-xs h-8"
                style={{
                  backgroundColor: annotation.backgroundColor || '#240CEF',
                  color: annotation.fontColor || '#FFFFFF',
                }}
              >
                Buy Now
              </Button>
            </div>

            {/* Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}