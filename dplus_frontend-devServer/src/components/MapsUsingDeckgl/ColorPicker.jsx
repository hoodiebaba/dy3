// import React, { useRef } from "react";

// const ColorPicker = ({ value, onChange }) => {
//   const inputRef = useRef(null);

//   return (
//     <div className="color-picker-root relative flex items-center">

//       {/* visible swatch */}
//       <div
//         className="w-6 h-6 rounded border cursor-pointer hover:scale-110 transition"
//         style={{ background: value }}
//         onClick={() => inputRef.current?.click()}
//       />

//       {/* native color picker */}
//       <input
//         ref={inputRef}
//         type="color"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="absolute opacity-0 w-0 h-0"
//       />

//     </div>
//   );
// };

// export default ColorPicker;

import React, { useRef } from "react";

const ColorPicker = ({ value, onChange }) => {

  const inputRef = useRef(null);

  return (
    <div
      className="relative flex items-center"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >

      <div
        className="w-6 h-6 rounded border cursor-pointer"
        style={{ background: value }}
        onClick={() => inputRef.current?.click()}
      />

      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 w-0 h-0"
      />

    </div>
  );
};

export default ColorPicker;