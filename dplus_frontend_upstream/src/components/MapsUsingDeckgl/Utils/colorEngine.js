/**
 * ============================================================
 * COLOR ENGINE
 * ============================================================
 *
 * Centralized color management for all map thematics.
 *
 * Supports three color strategies:
 *
 * 1. FIXED COLORS
 *    Used for categories with industry-standard colors
 *    Example: Technology (2G,3G,4G,5G)
 *
 * 2. PALETTE + SORTED KEYS
 *    Used for dynamic categories
 *    Example: Band, Region, Vendor
 *
 *    Keys are sorted first so colors stay stable across reloads.
 *
 * 3. RANGE COLORS
 *    Used for KPI metrics
 *    Example: RSSI, RSRP, SINR
 *
 *    Numeric value is mapped to a defined color range.
 *
 * ============================================================
 */

import { Palette } from "lucide-react";

/**
 * ============================================================
 * DEFAULT PALETTES
 * ============================================================
 *
 * These palettes are used for categorical thematics
 * like Band / Region / Vendor.
 *
 * 20 colors is usually enough for telecom datasets.
 */
export const COLOR_SCHEMES = {

  Default: [
    "#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd",
    "#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf",
    "#393b79","#637939","#8c6d31","#843c39","#7b4173",
    "#3182bd","#e6550d","#31a354","#756bb1","#636363"
  ],

  DataPlus: [
    "#4e79a7","#f28e2b","#e15759","#76b7b2","#59a14f",
    "#edc948","#b07aa1","#ff9da7","#9c755f","#bab0ab",
    "#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e",
    "#e6ab02","#a6761d","#666666","#a6cee3","#fb9a99"
  ]

};

/**
 * ============================================================
 * FIXED CATEGORY COLORS
 * ============================================================
 *
 * Used for telecom technologies.
 *
 * These colors should remain stable so that
 * engineers instantly recognize technologies.
 */
export const FIXED_COLORS = {

  Technology: {
    "2G": "#22c1c3",
    "3G": "#3b82f6",
    "4G": "#4338ca",
    "5G": "#9333ea"
  }

};

/**
 * ============================================================
 * TECHNOLOGY COLOR SCHEMES
 * ============================================================
 *
 * These are preset color schemes for Technology thematics.
 * Users can choose a scheme and then optionally customize.
 */

export const TECHNOLOGY_SCHEMES = {

  Default: {
    "2G": "#22c1c3",
    "3G": "#3b82f6",
    "4G": "#4338ca",
    "5G": "#9333ea"
  },

  DataPlus: {
    "2G": "#f97316",
    "3G": "#10b981",
    "4G": "#ef4444",
    "5G": "#6366f1"
  }

};

/**
 * ============================================================
 * KPI DEFAULT RANGE PRESETS
 * ============================================================
 *
 * These are standard telecom signal quality colors.
 *
 * Used when user selects KPI thematics.
 */
/**
 * ============================================================
 * KPI RANGE DEFAULTS
 * ============================================================
 * Single source of truth for all KPI numeric range colors.
 * Used by:
 * - Drive Test layer (AddMapLayersPanel)
 * - Cell KPI thematics (CellThematicsPanel)
 */
export const KPI_RANGE_DEFAULTS = {
    RSSI: [
        { min: -75,  max: 0,    color: "#22c55e", label: "Strong" },
        { min: -90,  max: -75,  color: "#eab308", label: "Good" },
        { min: -105, max: -90,  color: "#f97316", label: "Weak" },
        { min: -140, max: -105, color: "#ef4444", label: "Very Weak" }
    ],
    RSRP: [
        { min: -80,  max: 0,    color: "#22c55e", label: "Strong" },
        { min: -95,  max: -80,  color: "#eab308", label: "Good" },
        { min: -110, max: -95,  color: "#f97316", label: "Weak" },
        { min: -140, max: -110, color: "#ef4444", label: "Very Weak" }
    ],
    "DL Thrp": [
        { min: 50,  max: 1000, color: "#22c55e", label: "Excellent" },
        { min: 20,  max: 50,   color: "#eab308", label: "Good" },
        { min: 5,   max: 20,   color: "#f97316", label: "Fair" },
        { min: 0,   max: 5,    color: "#ef4444", label: "Poor" }
    ],
    Frequency: [
        { min: 2500, max: 6000, color: "#22c55e", label: "High" },
        { min: 1000, max: 2500, color: "#eab308", label: "Mid" },
        { min: 700,  max: 1000, color: "#f97316", label: "Low" },
        { min: 0,    max: 700,  color: "#ef4444", label: "Very Low" }
    ],
};

/**
 * ============================================================
 * deepCopyRanges()
 * ============================================================
 * Creates a mutable deep copy of range arrays.
 * Use whenever loading KPI_RANGE_DEFAULTS into local state
 * to prevent read-only mutation errors.
 * 
 * Also normalizes min/max to strings for consistent
 * display in RangeFilter inputs.
 */
export function deepCopyRanges(ranges = []) {
    return ranges.map(r => ({
        ...r,
        min: String(r.min),
        max: String(r.max),
    }));
}

/**
 * getDriveTestColor()
 * Used by TelecomMap for drive test point coloring
 */
export function getDriveTestColor(value, thematic, mode, customRanges = []) {
    const numeric = Number(value);
    const ranges = mode === "Custom" && customRanges.length > 0
        ? customRanges
        : KPI_RANGE_DEFAULTS[thematic] || [];

    for (const range of ranges) {
        if (numeric >= Number(range.min) && numeric <= Number(range.max)) {
            return { color: range.color, label: range.label || "Custom" };
        }
    }
    return { color: "#9ca3af", label: "Out of Range" };
}

/**
 * ============================================================
 * generatePaletteColors()
 * ============================================================
 *
 * Generates stable colors for categorical values.
 *
 * Steps:
 * 1. Remove duplicates
 * 2. Sort values alphabetically
 * 3. Assign colors sequentially from palette
 *
 * Sorting ensures that colors remain stable
 * even if backend sends values in different order.
 *
 * Example:
 *
 * values = ["LTE1800","NR3500","LTE2100"]
 *
 * sorted -> ["LTE1800","LTE2100","NR3500"]
 *
 * Result:
 * LTE1800 -> palette[0]
 * LTE2100 -> palette[1]
 * NR3500  -> palette[2]
 */
export function generatePaletteColors(values = [], palette = []) {

  if (!Array.isArray(values)) return {};

  // remove duplicates
  const uniqueValues = [...new Set(values)];

  // sort alphabetically to maintain stable mapping
  const sortedValues = uniqueValues.sort();

  const colorMap = {};

  sortedValues.forEach((value, index) => {

    colorMap[value] = palette[index % palette.length];

  });

  return colorMap;
}

/**
 * ============================================================
 * getRangeColor()
 * ============================================================
 *
 * Determines color based on numeric value ranges.
 *
 * Used for KPI thematics.
 *
 * Example:
 * RSSI = -85
 *
 * Range matched:
 * { min:-90 max:-75 color:yellow }
 *
 * Returns:
 * "#eab308"
 */
export function getRangeColor(value, ranges = []) {

  const numeric = Number(value);

  for (const range of ranges) {

    const min = Number(range.min);
    const max = Number(range.max);

    if (numeric >= min && numeric <= max) {
      return range.color;
    }

  }

  return null;
}

/**
 * ============================================================
 * buildDefaultThematic()
 * ============================================================
 *
 * Generates default color mapping for a thematic type.
 *
 * Used when user selects "Default Thematic".
 *
 * Example usage:
 *
 * buildDefaultThematic({
 *   category:"Band",
 *   values:["LTE1800","LTE2100","NR3500"]
 * })
 *
 */
export function buildDefaultThematic({ category, values }) {

  /**
   * TECHNOLOGY
   * Uses fixed telecom colors
   */
  if (category === "Technology") {

    return {
      type: "fixed",
      colors: FIXED_COLORS.Technology
    };

  }


  /**
   * BAND
   * Uses palette assignment
   */
  if (category === "Band") {

    const palette = COLOR_SCHEMES.Default;

    return {
      type: "palette",
      colors: generatePaletteColors(values, palette)
    };

  }


  /**
   * REGION
   * Also palette based
   */
  if (category === "Region") {

    const palette = COLOR_SCHEMES.Default;

    return {
      type: "palette",
      colors: generatePaletteColors(values, palette)
    };

  }


  /**
   * fallback
   */
  return {
    type: "palette",
    colors: {}
  };

}



/**
 * ============================================================
 * resolveColor()
 * ============================================================
 *
 * Universal color resolver used by map layers.
 *
 * Handles all color types.
 *
 * Parameters:
 *
 * type  -> "fixed" | "palette" | "range"
 * value -> category value
 * palette -> palette color map
 * ranges -> KPI ranges
 * fixed  -> fixed color map
 *
 */
export function resolveColor({
  type,
  value,
  palette,
  ranges,
  fixed
}) {

  /**
   * FIXED category
   */
  if (type === "fixed") {
    return fixed?.[value] || null;
  }


  /**
   * PALETTE category
   */
  if (type === "palette") {
    return palette?.[value] || null;
  }


  /**
   * RANGE category
   */
  if (type === "range") {
    return getRangeColor(value, ranges);
  }

  return null;

}


// It creates deterministic colors  using hashing
// (Band A → same color every time) 
export const stringToColor = (str) => {
  if (!str) return "#3b82f6";

  // create deterministic hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // convert hash → hue
  const hue = Math.abs(hash % 360);

  return `hsl(${hue}, 70%, 50%)`;
};

export const generateColorMap = (values = []) => {
  const map = {};

  values.forEach(v => {
    map[v] = stringToColor(v);
  });

  return map;
};

/**
 * ============================================================
 * RF PREDICTION COLOR SCALE
 * ============================================================
 * Default colors for RF prediction range labels.
 * Moved from rfColorScale.js — single source of truth.
 */
export const rsrpColorScale = {
    "-65 to -50 dBm (Excellent)":  [0, 176, 80, 255],
    "-75 to -65 dBm (Very Good)":  [112, 173, 71, 255],
    "-85 to -75 dBm (Good)":       [255, 255, 0, 255],
    "-90 to -85 dBm (Fair)":       [255, 192, 0, 255],
    "-95 to -90 dBm (Weak)":       [255, 128, 0, 255],
    "-100 to -95 dBm (Poor)":      [255, 0, 0, 255],
    "-105 to -100 dBm (Bad)":      [192, 0, 0, 255],
    "-120 to -105 dBm (No Cov.)":  [128, 128, 128, 255]
};