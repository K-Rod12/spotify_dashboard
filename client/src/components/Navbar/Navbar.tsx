import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sections } from "./content";
import SpotifyLogo from "../../assets/spotify-logo";
import React from "react";

export type SectionId = (typeof sections)[number]["id"];

interface NavbarProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar = (props: NavbarProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>("Profile");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the height and padding based on scrollY
  const height = Math.max(0, 4 - scrollY / 5) + "rem";
  const padding = Math.max(0.1, 1 - scrollY / 10) + "rem";
  const textOpacity = 1 - scrollY / 20; // Text disappears quicker
  const lineOpacity = 1 - scrollY / 100; // Line disappears slower

  return (
    <motion.nav
      style={{
        height,
        padding,
      }}
      className="
        fixed z-[999] top-0 left-0 w-full
        bg-white bg-opacity-[.08] backdrop-blur-lg
        transition-all duration-500
      "
    >
      <div className="flex items-center justify-between w-full">
        <div className="pl-4">
          <SpotifyLogo className="h-8 w-8 hidden md:block" />
        </div>
      <ul
        className="
          flex justify-center items-center gap-1 md:gap-2 
          font-medium text-white
        "
      >
        {sections.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => {
                setActiveSection(link.id);
                props.setCurrentPage(link.heading);
              }}
              className="relative text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 tracking-wide inline-block"
            >
              <AnimatePresence>
                {textOpacity > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: textOpacity }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }} // Quicker transition for text
                  >
                    {link.heading}
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {lineOpacity > 0 && activeSection === link.id && (
                  <motion.div
                    layoutId="bubble"
                    className="
                      absolute inset-0 -z-10
                      bg-[#1DB954] rounded-full
                    "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: lineOpacity }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} // Slightly slower transition for line
                  ></motion.div>
                )}
              </AnimatePresence>
            </button>
          </li>
        ))}
      </ul>
      <div className="pr-4 bg-blue-500"></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
