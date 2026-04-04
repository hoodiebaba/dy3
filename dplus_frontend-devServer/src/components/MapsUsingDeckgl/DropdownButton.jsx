import React from "react";

const DropdownButton = ({
  id,
  label,
  openDropdown,
  toggleDropdown,
  children
}) => {

  const isOpen = openDropdown === id;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>

      {/* BUTTON */}
      <button
        // onClick={() => toggleDropdown(id)}
        onClick={(e) => {
          e.stopPropagation();  
          toggleDropdown(id);
        }}
        className="
        w-full md:w-auto
        px-4 py-2
        bg-[#162a52]
        hover:bg-[#1e3a70]
        text-white text-sm
        rounded-lg
        border border-[#2c4a85]
        transition
        min-w-[120px]
        flex items-center justify-center
        "
      >
        {label} ∨
      </button>

      {/* DROPDOWN */}
      {isOpen && children}

    </div>
  );
};

export default DropdownButton;