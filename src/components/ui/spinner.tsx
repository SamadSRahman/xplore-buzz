import React from 'react';
import { motion } from 'framer-motion';

/**
 * A sleek, modern spinner component using Tailwind CSS and Framer Motion
 * Props:
 * - size: number (width/height in pixels)
 * - thickness: number (border thickness in pixels)
 * - colorFrom: string (gradient start color)
 * - colorTo: string (gradient end color)
 */
export default function Spinner({
  size = 40,
  thickness = 4,
  colorFrom = 'purple-500',
  colorTo = 'pink-500',
}) {
  const sizePx = `${size}px`;
  const borderSize = `${thickness}px`;

  return (
    <motion.div
      className={`rounded-full border-${thickness} border-t-transparent animate-spin`}
      style={{
        width: sizePx,
        height: sizePx,
        borderTopWidth: thickness,
        borderWidth: thickness,
        borderImage: `linear-gradient(90deg, theme('colors.${colorFrom}'), theme('colors.${colorTo}')) 1`,
        borderStyle: 'solid',
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    />
  );
}
