import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sections } from "./content";
import SpotifyLogo from "../../assets/spotify-logo";
import React from "react";
import SparkleIcon from "../../assets/SparkleIcon";

export type SectionId = (typeof sections)[number]["id"];

interface NavbarProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
}

const Navbar = (props: NavbarProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>("Profile");
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveSection(props.currentPage.replace(" ", "-") as SectionId);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      checkNavScroll();
    };

    const checkNavScroll = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener("scroll", checkNavScroll);
    }

    checkNavScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (navElement) {
        navElement.removeEventListener("scroll", checkNavScroll);
      }
    };
  }, [props.currentPage]);

  // Calculate the height and padding based on scrollY
  const height = isMobile
    ? Math.max(0, 3.5 - scrollY / 5) + "rem"
    : Math.max(0, 4.5 - scrollY / 5) + "rem";
  const padding = isMobile
    ? Math.max(0.1, 0.8 - scrollY / 10) + "rem"
    : Math.max(0.1, 1 - scrollY / 10) + "rem";
  const textOpacity = isMobile ? 1 - scrollY / 15 : 1 - scrollY / 20;
  const lineOpacity = isMobile ? 1 - scrollY / 50 : 1 - scrollY / 100;

  const scrollNav = (direction: "left" | "right") => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === "left" ? -100 : 100,
        behavior: "smooth",
      });
    }
  };

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
      <div className="flex items-center justify-between w-full px-3">
        <div className="hidden md:block">
          <SpotifyLogo className="h-8 w-8 hidden md:block" />
        </div>
        <div className="relative flex-grow md:flex-grow-0 overflow-hidden">
          {isMobile && showLeftArrow && (
            <button
              onClick={() => scrollNav("left")}
              className="fixed left-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent bg-opacity-50 p-1 rounded-full text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div
            ref={navRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ul
              className="
              flex justify-start items-center gap-1 md:gap-2
              font-medium text-white radius-lg
            "
            >
              {sections.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveSection(link.id);
                      props.setCurrentPage(link.heading);
                    }}
                    className="relative text-sm lg:text-lg py-1 md:py-2 px-2 md:px-4 tracking-wide inline-block whitespace-nowrap"
                  >
                    <AnimatePresence>
                      {textOpacity > 0 && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: textOpacity }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        >
                          {link.heading === "Generate" ? (
                            <div className="flex items-center gap-1">
                              <SparkleIcon />
                              Generate
                            </div>
                          ) : (
                            link.heading
                          )}
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
                          transition={{ duration: 0.2 }}
                        ></motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {isMobile && showRightArrow && (
            <button
              onClick={() => scrollNav("right")}
              className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent bg-opacity-50 p-1 rounded-full text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="pr-4 hidden md:block"></div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
