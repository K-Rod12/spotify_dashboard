import { useState } from "react";
import { motion } from "framer-motion";

import { sections } from "./content";
import React from "react";

export type SectionId = (typeof sections)[number]["id"];

interface NavbarProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  logout: () => void;
}

const Navbar = (props: NavbarProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>("Profile");
  
  return (
    <>
      <nav
        className="
          fixed z-[999] top-4 left-1/2 -translate-x-1/2
          px-2 md:px-3 py-1 md:py-2 rounded-full border border-white border-opacity-[.08]
          bg-white bg-opacity-[.08] backdrop-blur-lg
      "
      >
        <ul
          className="
            flex justify-center items-center gap-1 md:gap-2 
            font-medium text-white
          "
        >
          {sections.map((link) => (
            <li
              key={link.id}
              className={`${link.heading === "Logout" ? "bg-red-500 rounded-full" : ""}`}
            >
              <button
                onClick={() => {
                  setActiveSection(link.id);

                  if (link.heading === "Logout") {
                    props.logout();
                  } else {
                    props.setCurrentPage(link.heading);
                  }
                }}
                className="relative text-xs md:text-sm py-1 md:py-2 px-2 md:px-4 tracking-wide inline-block"
              >
                {link.heading}

                {activeSection === link.id && (
                  <motion.div
                    layoutId="bubble"
                    className="
                      absolute inset-0 -z-10
                      bg-[#1DB954] rounded-full
                    "
                    transition={{ type: "spring", duration: 0.6 }}
                  ></motion.div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
