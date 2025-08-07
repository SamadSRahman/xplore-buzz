'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Base overlay styles
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
      // Smooth animations
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      // Duration and easing
      "duration-300 ease-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <div className="light">
      <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Positioning and dimensions
        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
        "w-full max-w-lg max-h-[85vh] overflow-y-auto",
        // Light mode glassmorphism design
        "bg-white/95 backdrop-blur-xl",
        "border border-gray-200/50",
        // Enhanced shadows
        "shadow-2xl shadow-black/20",
        // Modern rounded corners
        "rounded-2xl",
        // Smooth animations with spring easing
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        // Enhanced duration and easing
        "duration-300 ease-out",
        // Focus styles
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        // Responsive padding
        "p-6 sm:p-8",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn(
        // Positioning
        "absolute right-4 top-7 z-10",
        // Enhanced button design
        "flex h-8 w-8 items-center justify-center",
        "rounded-full bg-gray-100/80",
        "border border-gray-200/50",
        // Hover and focus states
        "transition-all duration-200 ease-out",
        "hover:bg-gray-200/80",
        "hover:scale-105 hover:shadow-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        // Active state
        "active:scale-95",
        // Text color
        "text-gray-500 hover:text-gray-700"
      )}>
        <X className="h-4 w-4" />
        {/* <span className="sr-only">Close</span> */}
      </DialogPrimitive.Close>
          </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Spacing and layout
      "flex mb-6 items-center",
      // Enhanced bottom border with gradient
      "pb-6 border-b border-gray-200/60",
      // Subtle background gradient
      "relative",
      "before:absolute before:inset-x-0 before:bottom-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-gray-300/50 before:to-transparent",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Layout and spacing
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0",
      "mt-8 pt-6",
      // Enhanced top border with gradient
      "border-t border-gray-200/60",
      "relative",
      "before:absolute before:inset-x-0 before:top-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-gray-300/50 before:to-transparent",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Enhanced typography
      "text-2xl font-bold leading-tight tracking-tight",
      // Light mode color scheme
      "text-gray-900",
      // Subtle text shadow for depth
      "drop-shadow-sm",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      // Enhanced typography
      "text-base leading-relaxed",
      // Light mode color
      "text-gray-600",
      // Better line height for readability
      "mt-2",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};