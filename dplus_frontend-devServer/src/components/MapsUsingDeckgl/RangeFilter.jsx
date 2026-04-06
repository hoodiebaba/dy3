import React, { memo } from "react";
import ColorPicker from "./ColorPicker";

const RangeFilter = ({ value = [], onChange }) => {

  const ranges = value;
  const setRanges = onChange;

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

  /** Fits values like -140.00 without clipping; still fits typical layer panel width */
  const rowGrid =
    "grid grid-cols-[minmax(0,4rem)_minmax(0,4rem)_1.375rem_minmax(0,0.875rem)] items-center gap-x-1.5 gap-y-0.5";

  return (
    <div className="min-w-0 max-w-full overflow-x-hidden">

      <div className="mb-1.5 flex items-center justify-between gap-1">
        <span className="truncate text-xs font-semibold text-gray-600">
          Range Filter
        </span>

        <button
          type="button"
          onClick={addRange}
          className="shrink-0 text-base font-bold leading-none text-blue-600 hover:text-blue-500"
        >
          +
        </button>
      </div>

      <div className={`${rowGrid} mb-1 text-[10px] font-semibold leading-tight text-gray-600`}>
        <span className="truncate" title="Min (>)">
          Min
        </span>
        <span className="truncate" title="Max (≤)">
          Max
        </span>
        <span className="text-center">Clr</span>
        <span />
      </div>

      {ranges.map((range, index) => (

        <div key={index} className={`${rowGrid} mb-1.5 min-w-0`}>

          <input
            type="number"
            step="0.01"
            value={range.min}
            onChange={(e) =>
              updateRange(index, "min", e.target.value)
            }
            onBlur={() => handleRangeBlur(index)}
            className="min-w-0 w-full max-w-[4rem] rounded border border-neutral-300 bg-white px-1 py-1 text-center text-xs tabular-nums text-neutral-900"
          />

          <input
            type="number"
            step="0.01"
            value={range.max}
            onChange={(e) =>
              updateRange(index, "max", e.target.value)
            }
            onBlur={() => handleRangeBlur(index)}
            className="min-w-0 w-full max-w-[4rem] rounded border border-neutral-300 bg-white px-1 py-1 text-center text-xs tabular-nums text-neutral-900"
          />

          <div className="flex justify-center">
            <ColorPicker
              compact
              value={range.color}
              onChange={(color) =>
                updateRange(index, "color", color)
              }
            />
          </div>

          {ranges.length > 1 ? (
            <button
              type="button"
              onClick={() => removeRange(index)}
              className="justify-self-center text-[10px] leading-none text-red-600 hover:text-red-500"
            >
              ✕
            </button>
          ) : (
            <span />
          )}

        </div>

      ))}

    </div>
  );
};

export default memo(RangeFilter);
