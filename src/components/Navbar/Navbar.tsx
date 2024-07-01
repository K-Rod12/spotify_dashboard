import { useState } from "react";
import { motion } from "framer-motion";

import { sections } from "./content";

export type SectionId = (typeof sections)[number]["id"];

interface NavbarProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  logout: () => void;
}

const Navbar = (props: NavbarProps) => {
  const [activeSection, setActiveSection] = useState<SectionId>("Profile");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0); // we need to keep track of this to disable the observer temporarily when user clicks on a link

  return (
    <>
      <nav
        className="
        fixed z-[999] top-4 left-1/2 -translate-x-1/2
        px-3 py-2 rounded-full border border-white border-opacity-[.08]
        bg-white bg-opacity-[.08] backdrop-blur-lg
      "
      >
        <ul
          className="
          flex justify-center items-center gap-2 
          font-medium text-white
        "
        >
          {sections.map((link) => (
            <li
              key={link.id}
              className={`${
                link.heading === "Logout" ? "bg-red-500 rounded-full" : ""
              }`}
            >
              <button
                onClick={() => {
                  setTimeOfLastClick(Date.now());
                  setActiveSection(link.id);

                  if (link.heading === "Logout") {
                    props.logout();
                  } else {
                    props.setCurrentPage(link.heading);
                  }
                }}
                className="relative text-sm py-2 px-4 tracking-wide inline-block"
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
