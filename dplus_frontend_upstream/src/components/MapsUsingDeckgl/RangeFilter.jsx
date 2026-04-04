// import React from "react";
// import ColorPicker from "../ColorPicker";

// // const RangeFilter = ({ value = [], onChange }) => {

// //   // const ranges = value;

// //   // const setRanges = (newRanges) => {
// //   //   onChange?.(newRanges);
// //   // };

// //   // const addRange = () => {

// //   //   const last = ranges[ranges.length - 1];

// //   //   const newMin =
// //   //     last?.max !== "" ? parseFloat(last.max) : "";

// //   //   setRanges([
// //   //     ...ranges,
// //   //     { min: newMin, max: "", color: "#ff0000" }
// //   //   ]);

// //   // };

// //   // const updateRange = (index, field, val) => {

// //   //   const updated = [...ranges];

// //   //   updated[index][field] = val;

// //   //   setRanges(updated);

// //   // };

// //   // const removeRange = (index) => {

// //   //   const updated = ranges.filter((_, i) => i !== index);

// //   //   setRanges(updated);

// //   // };

// //   // const validateRange = (index) => {

// //   //   const updated = [...ranges];

// //   //   let min = parseFloat(updated[index].min);
// //   //   let max = parseFloat(updated[index].max);

// //   //   if (isNaN(min)) min = "";
// //   //   if (isNaN(max)) max = "";

// //   //   // rule 1: min must be >= previous max
// //   //   if (index > 0 && min !== "") {

// //   //     const prevMax = parseFloat(updated[index - 1].max);

// //   //     if (!isNaN(prevMax) && min < prevMax) {
// //   //       min = prevMax;
// //   //     }

// //   //   }

// //   //   // rule 2: max >= min
// //   //   if (min !== "" && max !== "" && max < min) {
// //   //     max = min;
// //   //   }

// //   //   // format decimals
// //   //   updated[index].min =
// //   //     min === "" ? "" : min.toFixed(2);

// //   //   updated[index].max =
// //   //     max === "" ? "" : max.toFixed(2);

// //   //   // auto chain next range
// //   //   if (index < updated.length - 1 && updated[index].max !== "") {
// //   //     updated[index + 1].min = updated[index].max;
// //   //   }

// //   //   setRanges(updated);

// //   // };



// //   return (
// //     <div>

// //       <div className="flex items-center justify-between mb-2">
// //         <span className="text-xs font-semibold text-gray-500">
// //           Range Filter
// //         </span>

// //         <button
// //           onClick={addRange}
// //           className="text-blue-600 font-bold text-lg"
// //         >
// //           +
// //         </button>
// //       </div>

// //       <div className="grid grid-cols-[80px_80px_40px_20px] gap-2 mb-1 text-xs font-semibold text-gray-500">
// //         <span>Min</span>
// //         <span>Max</span>
// //         <span></span>
// //         <span></span>
// //       </div>

// //       {ranges.map((range, index) => (

// //         <div
// //           key={index}
// //           className="grid grid-cols-[80px_80px_40px_20px] gap-2 mb-2 items-center"
// //         >

// //           <input
// //             type="number"
// //             step="0.01"
// //             value={range.min}
// //             onChange={(e) =>
// //               updateRange(index, "min", e.target.value)
// //             }
// //             onBlur={() => validateRange(index)}
// //             className="border rounded px-2 py-1 text-sm"
// //           />

// //           <input
// //             type="number"
// //             step="0.01"
// //             value={range.max}
// //             onChange={(e) =>
// //               updateRange(index, "max", e.target.value)
// //             }
// //             onBlur={() => validateRange(index)}
// //             className="border rounded px-2 py-1 text-sm"
// //           />

// //           <ColorPicker
// //             value={range.color}
// //             onChange={(color) =>
// //               updateRange(index, "color", color)
// //             }
// //           />

// //           {ranges.length > 1 && (
// //             <button
// //               onClick={() => removeRange(index)}
// //               className="text-red-500 text-sm"
// //             >
// //               ✕
// //             </button>
// //           )}

// //         </div>

// //       ))}

// //     </div>
// //   );
// // };

// // export default RangeFilter;

// const RangeFilter = ({ value = [], onChange  }) => {

//   const ranges = value;
//   const setRanges = onChange;

//  const addRange = () => {
//     let newMin = "";
//     if (ranges.length > 0) {
//       const last = ranges[ranges.length - 1];
//       if (last?.max !== "") {
//         newMin = parseFloat(last.max);
//       }
//     }

//     setRanges([
//       ...ranges,
//       { min: newMin, max: "", color: "#ef4444" }
//     ]);

//   };

//   const updateRange = (index, key, value) => {
//     const updated = [...ranges];

//     // allow free typing
//     updated[index][key] = value;

//     setRanges(updated);
//   };

//   const handleRangeBlur = (index) => {
//     const updated = [...ranges];

//     let min = parseFloat(updated[index].min);
//     let max = parseFloat(updated[index].max);

//     if (isNaN(min)) min = "";
//     if (isNaN(max)) max = "";

//     // previous range constraint
//     if (index > 0 && min !== "") {
//       const prevMax = parseFloat(updated[index - 1].max);
//       if (!isNaN(prevMax) && min < prevMax) {
//         min = prevMax;
//       }
//     }

//     // max >= min
//     if (min !== "" && max !== "" && max < min) {
//       max = min;
//     }

//     // format decimals
//     updated[index].min = min === "" ? "" : min.toFixed(2);
//     updated[index].max = max === "" ? "" : max.toFixed(2);

//     // chain next range
//     if (index < updated.length - 1 && updated[index].max !== "") {
//       updated[index + 1].min = updated[index].max;
//     }

//     setRanges(updated);
//   };

//   const removeRange = (index) => {
//     const updated = ranges.filter((_, i) => i !== index);
//     setRanges(updated);
//   };

//   if (!ranges) return null;
//   return (
//     <div>

//       <div className="flex items-center justify-between mb-2">
//         <span className="text-xs font-semibold text-gray-500">
//           Range Filter
//         </span>

//         <button
//           onClick={addRange}
//           className="text-blue-600 font-bold text-lg"
//         >
//           +
//         </button>
//       </div>

//       <div className="grid grid-cols-[80px_80px_40px_30px] gap-2 mb-1 text-xs font-semibold text-gray-500">
//         <span>Min (&gt;)</span>
//         <span>Max (&le;)</span>
//         <span>Color</span>
//         <span></span>
//       </div>

//       {ranges.map((range, index) => (
//         <div key={index} className="flex items-center gap-2 mb-2">

//           <input
//             type="number"
//             step="0.01"
//             placeholder="Min"
//             value={range.min}
//             onChange={(e) => {
//               updateRange(index, "min", e.target.value);
//             }}
//             onBlur={() => handleRangeBlur(index)}
//             className="border rounded px-2 py-1 w-20 text-sm"
//           />

//           <input
//             type="number"
//             step="0.01"
//             placeholder="Max"
//             value={range.max}
//             onChange={(e) => {
//               updateRange(index, "max", e.target.value);
//             }}
//             onBlur={() => handleRangeBlur(index)}
//             className="border rounded px-2 py-1 w-20 text-sm"
//           />

//           <ColorPicker
//             value={range.color}
//             onChange={(color) =>
//               updateRange(index, "color", color)
//             }
//           />

//           {ranges.length > 1 && (
//             <button
//               onClick={() => removeRange(index)}
//               className="text-red-500 text-sm"
//             >
//               ✕
//             </button>
//           )}

//         </div>
//       ))}

//     </div>
//   );
// };

// export default RangeFilter;

// /* ---------- Helper function (optional use) ---------- */

// export const getRangeColor = (value, ranges) => {

//   const v = parseFloat(value);

//   for (const r of ranges) {

//     const min = parseFloat(r.min);
//     const max = parseFloat(r.max);

//     if (v >= min && v < max) {
//       return r.color;
//     }

//   }

//   return null;

// };


import React, { memo } from "react";
import ColorPicker from "./ColorPicker";

const RangeFilter = ({ value = [], onChange }) => {

  const ranges = value;
  const setRanges = onChange;

  // const addRange = () => {
  //   let newMin = "";

  //   if (ranges.length > 0) {
  //     const last = ranges[ranges.length - 1];

  //     if (last?.max !== "") {
  //       newMin = parseFloat(last.max);
  //     }
  //   }

  //   setRanges([
  //     ...ranges,
  //     { min: newMin, max: "", color: "#ef4444" }
  //   ]);
  // };
  const addRange = () => {
    const last = ranges[ranges.length - 1];
    
    const newMax = last?.min !== "" ? last.min : "";
    
    setRanges([
        ...ranges,
        { min: "", max: newMax, color: "#ef4444" }
    ]);
}

  const updateRange = (index, key, value) => {
    const updated = [...ranges];
    updated[index][key] = value;
    setRanges(updated);
  };

  // const handleRangeBlur = (index) => {

  //   const updated = [...ranges];

  //   let min = parseFloat(updated[index].min);
  //   let max = parseFloat(updated[index].max);

  //   if (isNaN(min)) min = "";
  //   if (isNaN(max)) max = "";

  //   if (index > 0 && min !== "") {

  //     const prevMax = parseFloat(updated[index - 1].max);

  //     if (!isNaN(prevMax) && min < prevMax) {
  //       min = prevMax;
  //     }

  //   }

  //   if (min !== "" && max !== "" && max < min) {
  //     max = min;
  //   }

  //   updated[index].min = min === "" ? "" : min.toFixed(2);
  //   updated[index].max = max === "" ? "" : max.toFixed(2);

  //   if (index < updated.length - 1 && updated[index].max !== "") {
  //     updated[index + 1].min = updated[index].max;
  //   }

  //   setRanges(updated);
  // };

const handleRangeBlur = (index) => {
    const updated = ranges.map(r => ({ ...r }));
    
    const min = parseFloat(updated[index].min);
    const max = parseFloat(updated[index].max);

    updated[index].min = isNaN(min) ? "" : min.toFixed(2);
    updated[index].max = isNaN(max) ? "" : max.toFixed(2);

    setRanges(updated);
};
  const removeRange = (index) => {
    const updated = ranges.filter((_, i) => i !== index);
    setRanges(updated);
  };

  return (
    <div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500">
          Range Filter
        </span>

        <button
          onClick={addRange}
          className="text-blue-600 font-bold text-lg"
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-[80px_80px_40px_30px] gap-2 mb-1 text-xs font-semibold text-gray-500">
        <span>Min (&gt;)</span>
        <span>Max (&le;)</span>
        <span>Color</span>
        <span></span>
      </div>

      {ranges.map((range, index) => (

        <div key={index} className="flex items-center gap-2 mb-2">

          <input
            type="number"
            step="0.01"
            value={range.min}
            onChange={(e) =>
              updateRange(index, "min", e.target.value)
            }
            onBlur={() => handleRangeBlur(index)}
            className="border rounded px-2 py-1 w-20 text-sm"
          />

          <input
            type="number"
            step="0.01"
            value={range.max}
            onChange={(e) =>
              updateRange(index, "max", e.target.value)
            }
            onBlur={() => handleRangeBlur(index)}
            className="border rounded px-2 py-1 w-20 text-sm"
          />

          <ColorPicker
            value={range.color}
            onChange={(color) =>
              updateRange(index, "color", color)
            }
          />

          {ranges.length > 1 && (
            <button
              onClick={() => removeRange(index)}
              className="text-red-500 text-sm"
            >
              ✕
            </button>
          )}

        </div>

      ))}

    </div>
  );
};

export default memo(RangeFilter);