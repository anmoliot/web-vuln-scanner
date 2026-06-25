import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { SquashHamburger } from "./SquashHamburger";
import { ScrambleText } from "./ScrambleText";

export const SynapseXNavbar = ({ entranceComplete, onNavigate, isAuthenticated, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollTo = (targetY) => {
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
    setIsOpen(false);
  };

  // The menu pill is wider on desktop to accommodate links.
  // Closed size: 48px (desktop), 36px (mobile)
  // Open size: 400px (desktop, since we have more links like Login/Register), 100% (mobile)
  const menuPillWidth = isMobile
    ? isOpen
      ? "100%"
      : "36px"
    : isOpen
    ? "400px"
    : "48px";

  const menuPillHeight = isMobile ? "36px" : "48px";
  const menuPillRadius = isMobile ? "10px" : "14px";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={entranceComplete ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-transparent pointer-events-none font-sans"
    >
      {/* Left side pill container */}
      <div className="flex items-center gap-2 pointer-events-auto max-w-[calc(100%-120px)] sm:max-w-none">
        {/* Logo Pill */}
        <motion.button
          onClick={() => onNavigate("marketing")}
          animate={
            isOpen && isMobile
              ? { width: 0, paddingLeft: 0, paddingRight: 0, opacity: 0 }
              : {
                  width: isMobile ? 140 : 185,
                  paddingLeft: isMobile ? 10 : 20,
                  paddingRight: isMobile ? 10 : 20,
                  opacity: 1,
                }
          }
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center gap-2 overflow-hidden border border-white/5 cursor-pointer text-left focus:outline-none"
        >
          <Logo className="shrink-0" size={isMobile ? 20 : 26} />
          <span className="text-[13px] sm:text-[16px] font-medium tracking-tight text-white select-none whitespace-nowrap">
            AdaptiveScan
          </span>
        </motion.button>

        {/* Expanding Menu Pill */}
        <motion.div
          animate={{
            width: menuPillWidth,
            height: menuPillHeight,
            borderRadius: menuPillRadius,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="bg-white/15 backdrop-blur-md flex items-center overflow-hidden border border-white/5 relative"
        >
          {/* Hamburger Container */}
          <div
            className={`flex items-center justify-center shrink-0 transition-all duration-300 ${
              isOpen
                ? isMobile
                  ? "w-7 h-7 rounded-[7px] bg-white/10 ml-1"
                  : "w-9 h-9 rounded-[11px] bg-white/10 hover:bg-white/20 ml-1.5"
                : isMobile
                ? "w-9 h-9"
                : "w-12 h-12"
            }`}
          >
            <SquashHamburger isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>

          {/* Navigation Links inside capsule */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 sm:gap-6 ml-4 sm:ml-6 whitespace-nowrap text-[13px] sm:text-[15px]"
              >
                <button
                  onClick={() => handleScrollTo(window.innerHeight)}
                  onMouseEnter={() => setHoveredLink("about")}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                >
                  <ScrambleText text="About" isHovered={hoveredLink === "about"} />
                </button>
                <button
                  onClick={() => handleScrollTo(window.innerHeight * 2)}
                  onMouseEnter={() => setHoveredLink("metrics")}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                >
                  <ScrambleText text="Metrics" isHovered={hoveredLink === "metrics"} />
                </button>

                {/* Authentication / Console shortcuts */}
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("dashboard");
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredLink("console")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                    >
                      <ScrambleText text="Console" isHovered={hoveredLink === "console"} />
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredLink("logout")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                    >
                      <ScrambleText text="Logout" isHovered={hoveredLink === "logout"} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("login");
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredLink("login")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                    >
                      <ScrambleText text="Login" isHovered={hoveredLink === "login"} />
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("register");
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHoveredLink("register")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="font-normal text-white/85 hover:text-white cursor-pointer focus:outline-none"
                    >
                      <ScrambleText text="Register" isHovered={hoveredLink === "register"} />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right side GitHub Button */}
      <div className="pointer-events-auto">
        <motion.a
          href="https://github.com/anmoliot/web-vuln-scanner"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03, backgroundColor: "#e2e2e6" }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHoveredLink("github")}
          onMouseLeave={() => setHoveredLink(null)}
          className="h-9 sm:h-12 px-3.5 sm:px-6 bg-white text-black rounded-full flex items-center justify-center gap-1.5 sm:gap-2 font-medium cursor-pointer no-underline"
        >
          <i className="bi bi-github text-[14px] sm:text-[18px]"></i>
          <span className="text-[13px] sm:text-[16px]">
            <ScrambleText text="GitHub" isHovered={hoveredLink === "github"} />
          </span>
        </motion.a>
      </div>
    </motion.nav>
  );
};
