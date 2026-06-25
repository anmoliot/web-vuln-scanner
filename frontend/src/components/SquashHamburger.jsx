import React from "react";
import { motion } from "framer-motion";

export const SquashHamburger = ({ isOpen, onClick }) => {
  const transition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center focus:outline-none"
      style={{ width: "24px", height: "24px" }}
      aria-label="Toggle menu"
    >
      <div className="relative w-[15px] h-[10px] md:w-[18px] md:h-[12px]">
        {/* Top Bar */}
        <motion.span
          animate={isOpen ? { top: "50%", y: "-50%", rotate: 45 } : { top: 0, y: 0, rotate: 0 }}
          transition={transition}
          className="absolute left-0 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
          style={{ originX: 0.5, originY: 0.5 }}
        />
        {/* Middle Bar */}
        <motion.span
          animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1, top: "50%", y: "-50%" }}
          transition={transition}
          className="absolute left-0 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
          style={{ top: "50%", y: "-50%" }}
        />
        {/* Bottom Bar */}
        <motion.span
          animate={isOpen ? { bottom: "50%", y: "50%", rotate: -45 } : { bottom: 0, y: 0, rotate: 0 }}
          transition={transition}
          className="absolute left-0 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
          style={{ originX: 0.5, originY: 0.5 }}
        />
      </div>
    </button>
  );
};
