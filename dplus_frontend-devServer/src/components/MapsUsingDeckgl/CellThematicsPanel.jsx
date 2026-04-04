import React, { useState , useMemo, useEffect, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import MapActions from "../../store/actions/map-actions";
import AuthActions from "../../store/actions/auth-actions";
// import { generateColorMap } from "./Utils/generateColorMap";
import ColorPicker from "./ColorPicker";
import OpacitySlider from "./OpacitySlider";
import {
  COLOR_SCHEMES,
  FIXED_COLORS,
  TECHNOLOGY_SCHEMES,
  generatePaletteColors,
  KPI_RANGE_DEFAULTS,
  deepCopyRanges,
} from "./Utils/colorEngine";
import RangeFilter from "./RangeFilter";

const THEMATIC_TYPES = [
"KPIs",
"Technology",
"Band",
"Region",
];

const kpiThematicOptions = [
    "RSSI",
    "RSRP",
    "DL Thrp",
    "Frequency",
];

// const CellThematicsPanel = ({ openDropdown, toggleDropdown }) => {
const CellThematicsPanel = ({ setCellThematicsConfig,
  tempLegend,
  setTempLegend }) => {

    const dispatch = useDispatch();

    const techMeta = useSelector(state => state.map.telecomTechMeta) ?? [];
    const filterMeta = useSelector(state => state.map.telecomFilterMeta) ?? {};
    const activeThematic = useSelector(state => state.map.activeThematic);

    const mapConfig = useSelector(state => state.map.config);

    const type = activeThematic?.type || "Default";
    const colors = activeThematic?.colors || {};
    // const [opacity, setOpacity] = useState(
    //     activeThematic?.opacity ?? 0.9
    // );

    const [tempType, setTempType] = useState(type);
    
    const [tempColors, setTempColors] = useState(colors);
    const [selectedScheme, setSelectedScheme] = useState();
    const [selectedBandPalette, setSelectedBandPalette] = useState("Telecom20");
    const [selectedRegionPalette, setSelectedRegionPalette] = useState("Telecom20");

    const [kpiStartDateTime, setKpiStartDateTime] = useState("");
    const [kpiEndDateTime, setKpiEndDateTime] = useState("");
    const [selectedKpi, setSelectedKpi] = useState(kpiThematicOptions[0]);
    const [kpiRanges, setKpiRanges] = useState(
        deepCopyRanges(KPI_RANGE_DEFAULTS[kpiThematicOptions[0]])
    );
    const [kpiMode, setKpiMode] = useState("Default");

    const [cellScale, setCellScale] = useState(mapConfig.mapScale ?? 1);

    // const addKpiRange = () => {
    //     const last = kpiRanges[kpiRanges.length - 1];
    //     const newMin =
    //         last.max !== "" ? parseFloat(last.max) : "";

    //     setKpiRanges([
    //         ...kpiRanges,
    //         { min: newMin, max: "", color: "#ef4444" }
    //     ]);
    // };
    // // Allow free typing (store string)
    // const updateKpiRange = (index, key, value) => {
    //     const updated = [...kpiRanges];

    //     // allow free typing
    //     updated[index][key] = value;

    //     setKpiRanges(updated);
    // };

    // // Validate + format when leaving field
    // const handleRangeBlur = (index) => {
    //     const updated = [...kpiRanges];
    //     let min = parseFloat(updated[index].min);
    //     let max = parseFloat(updated[index].max);

    //     if (isNaN(min)) min = "";
    //     if (isNaN(max)) max = "";

    //     // previous range constraint
    //     if (index > 0 && min !== "") {
    //         const prevMax = parseFloat(updated[index - 1].max);
    //         if (!isNaN(prevMax) && min < prevMax) {
    //         min = prevMax;
    //         }
    //     }

    //     // max >= min
    //     if (min !== "" && max !== "" && max < min) {
    //         max = min;
    //     }

    //     // format to 2 decimals
    //     updated[index].min = min === "" ? "" : min.toFixed(2);
    //     updated[index].max = max === "" ? "" : max.toFixed(2);

    //     setKpiRanges(updated);
    // };

    // const removeKpiRange = (index) => {
    //     const updated = kpiRanges.filter((_, i) => i !== index);
    //     setKpiRanges(updated);
    // };

    const techGrouped = useMemo(() => {
        const source = Array.isArray(techMeta) ? techMeta : [];
        return source.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item.name);
        return acc;

        }, {});

    }, [techMeta]);

    const regions = useMemo(() => {
        if (!Array.isArray(filterMeta?.d1)) return [];

        const regionParent = filterMeta.d1.find(
            item => item.parent === "Region"
        );

        const regionGroup = regionParent?.child?.find(
            item => item.name === "Region"
        );

        return regionGroup?.columnName || [];
    }, [filterMeta]);

    // const defaultColors = useMemo(() => {

    //     const techValues = techMeta.map(t => t.category);
    //     const bandValues = techMeta.map(t => t.name);
    //     const regionValues = regions.map(r => r.name);

    //     return {
    //         Technology: generateColorMap([...new Set(techValues)]),
    //         Band: generateColorMap([...new Set(bandValues)]),
    //         Region: generateColorMap([...new Set(regionValues)]),
    //         KPIs: generateColorMap(kpiThematicOptions)   // ✅ ADD THIS
    //     };

    // }, [techMeta, regions]);

    const applyTechnologyScheme = (schemeName) => {

        const scheme = TECHNOLOGY_SCHEMES[schemeName];
        if (!scheme) return;

        setSelectedScheme(schemeName);
        setTempColors(prev => ({
            ...prev,
            ...scheme
        }));

    };

    const applyBandPalette = (paletteName) => {

        const palette = COLOR_SCHEMES[paletteName];

        if (!palette) return;

        const bandValues = [...new Set(techMeta.map(t => t.name))];
        const colors = generatePaletteColors(bandValues, palette);

        setSelectedBandPalette(paletteName);
        setTempColors(prev => ({
            ...prev,
            ...colors
        }));

    };

    const applyRegionPalette = (paletteName) => {

        const palette = COLOR_SCHEMES[paletteName];

        if (!palette) return;

        const regionValues = regions.map(r => r.name);

        const colors = generatePaletteColors(regionValues, palette);

        setSelectedRegionPalette(paletteName);

        setTempColors(prev => ({
            ...prev,
            ...colors
        }));

    };

    const defaultColors = useMemo(() => {

        const techValues = [...new Set(techMeta.map(t => t.category))];
        const bandValues = [...new Set(techMeta.map(t => t.name))];
        const regionValues = regions.map(r => r.name);

        return {

            // fixed telecom colors
            Technology: FIXED_COLORS.Technology,

            // palette + sorted
            Band: generatePaletteColors(
            bandValues,
            COLOR_SCHEMES.Default
            ),

            Region: generatePaletteColors(
            regionValues,
            COLOR_SCHEMES.Default
            ),

            KPIs: KPI_RANGE_DEFAULTS

        };

    }, [techMeta, regions]);

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        if (!Object.keys(defaultColors.Band).length) return;

        hasInitialized.current = true;
        setTempType("Band");
        setTempColors(defaultColors.Band);
        setSelectedBandPalette("Default"); 

    }, [defaultColors.Band]);

    const handleColorChange = (key, value) => {
        setTempColors(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // const handleApply = () => {
    //     const payload = {
    //         type: tempType,
    //         colors: tempColors,
    //         opacity,
    //          kpiConfig: {
    //             startDateTime: kpiStartDateTime,
    //             endDateTime: kpiEndDateTime,
    //             kpi: selectedKpi,
    //             ranges: kpiRanges
    //         }
    //     };
    //     dispatch(MapActions.setActiveThematic(payload));
    //     dispatch(
    //         AuthActions.setupConf(true, {
    //         saveThematics: JSON.stringify(payload)
    //         })
    //     );
    //     toggleDropdown(null);
    // };

    // const handleReset = () => {
    //     const payload = {
    //         type: "Default",
    //         // colors: {}
    //         colors: {
    //             ...defaultColors.Technology,
    //             ...defaultColors.Band,
    //             ...defaultColors.Region,
    //             // ...defaultColors.KPIs,
    //         }
    //     };

    //     // reset local temp state
    //     setTempType("Default");
    //     // setTempColors({});
    //     setTempColors({
    //         ...defaultColors.Technology,
    //         ...defaultColors.Band,
    //         ...defaultColors.Region,
    //         // ...defaultColors.KPIs
    //     });

    //     // reset redux thematic
    //     dispatch(MapActions.setActiveThematic(payload));

    //     // save Reseted thematic
    //     dispatch(
    //         AuthActions.setupConf(true, {
    //             saveThematics: JSON.stringify(payload)
    //         })
    //     );
    //     toggleDropdown(null);
    // };

    // const handleReset = () => {

    //     const payload = {
    //         type: "Technology",
    //         colors: defaultColors.Technology,
    //         opacity: 1
    //     };

    //     setTempType("Technology");
    //     setTempColors(defaultColors.Technology);  
    //     setSelectedScheme("Default");

    //     dispatch(MapActions.setActiveThematic(payload));

    //     };

//     useEffect(() => {

//     window.__cellThematicsState = {
//         type: tempType,
//         colors: tempColors,
//         opacity,
//         kpiConfig: {
//             startDateTime: kpiStartDateTime,
//             endDateTime: kpiEndDateTime,
//             kpi: selectedKpi,
//             ranges: kpiRanges
//         }
//     };

// }, [tempType, tempColors, opacity, kpiRanges, selectedKpi]);


    // useEffect(() => {
    //     if (openDropdown === "cellThematics") {
    //         setTempType(type);
    //         setTempColors(colors);
    //         setOpacity(activeThematic?.opacity ?? 0.9);
    //     }
    // }, [openDropdown, type, colors]);

    // useEffect(() => {
    //     if (openDropdown === "cellThematics") {

    //         setTempType(type);
    //         setTempColors(colors);
    //         setOpacity(activeThematic?.opacity ?? 0.9);

    //         // detect scheme for Technology
    //         if (type === "Technology") {

    //             const matchedScheme = Object.keys(TECHNOLOGY_SCHEMES).find(
    //                 scheme =>
    //                     ["2G","3G","4G","5G"].every(
    //                         tech =>
    //                             TECHNOLOGY_SCHEMES[scheme][tech] === colors?.[tech]
    //                     )
    //             );

    //             setSelectedScheme(matchedScheme || "");

    //         }

    //     }
    // }, [openDropdown, type, colors, activeThematic]);
    // useEffect(() => {

    //     setTempType(type);
    //     setTempColors(colors);
    //     setOpacity(activeThematic?.opacity ?? 0.9);

    //     if (tempType !== "Technology") return;
        
    //     if (type === "Technology") {
    //         const matched = Object.keys(TECHNOLOGY_SCHEMES).find(
    //             scheme =>
    //                 ["2G","3G","4G","5G"].every(
    //                     tech =>
    //                         TECHNOLOGY_SCHEMES[scheme][tech] === colors?.[tech]
    //                 )
    //         );
    //         setSelectedScheme(matched || "Default");
    //     }

    // }, [activeThematic, type]);

    useEffect(() => {
        setTempType(type);
        setTempColors(colors);
        // setOpacity(activeThematic?.opacity ?? 0.9);

        // reset ref if colors are empty (after Clear)
        if (!colors || Object.keys(colors).length === 0) {
            hasInitialized.current = false;
        }

        if (type === "Technology") {
            const sourceColors =
                Object.keys(colors || {}).length > 0
                    ? colors
                    : tempColors;

            const matched = Object.keys(TECHNOLOGY_SCHEMES).find(
                scheme =>
                    ["2G","3G","4G","5G"].every(
                        tech => TECHNOLOGY_SCHEMES[scheme][tech] === sourceColors?.[tech]
                    )
            );
            setSelectedScheme(matched || "Default");
            return;
        }

        if (type === "Band") {
            setSelectedBandPalette("Default");  // ← auto-select Default palette
            return;
        }

        if (type === "Region") {
            setSelectedRegionPalette("Default");  // ← auto-select Default palette
            return;
        }

    }, [activeThematic, type]);

    useEffect(() => {

        if (!setCellThematicsConfig) return;

        const payload = {
            type: tempType,
            colors: Object.keys(tempColors).length > 0 
                ? tempColors 
                : defaultColors[tempType] || {},
            // opacity,
            scale: cellScale,  
            kpiConfig: {
                startDateTime: kpiStartDateTime,
                endDateTime: kpiEndDateTime,
                kpi: selectedKpi,
                mode: kpiMode, 
                ranges: kpiRanges,
            }
        };

        setCellThematicsConfig(payload);

        }, [
        tempType,
        tempColors,
        // opacity,
        kpiStartDateTime,
        kpiEndDateTime,
        selectedKpi,
        kpiMode, 
        kpiRanges,
        cellScale,
        // defaultColors,
    ]);

    useEffect(() => {
        setCellScale(mapConfig.mapScale ?? 1);
    }, [mapConfig.mapScale]);

    useEffect(() => {
        // reset to Default mode and load new defaults when KPI changes
        setKpiMode("Default");
        setKpiRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedKpi]));
    }, [selectedKpi]);

  return (
    <div className="relative">

        {/* KPI Themactics  */}
            {/* OPACITY */}
            {/* <div className="mb-3 border-b pb-3">

                <div className="flex justify-between items-center mb-1">

                    <span className="text-xs font-semibold text-gray-500">
                    Opacity
                    </span>

                    <span className="text-xs text-gray-600">
                    {Math.round(opacity * 100)}%
                    </span>

                </div>

                <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full"
                />

            </div> */}

            {/*  LEGENDS  */}
            <div className="flex items-center justify-between mb-3 border-b pb-3 mt-3">
                <span className="text-xs font-semibold text-gray-500">
                    Show Legend
                </span>

                <input
                    type="checkbox"
                    checked={!!tempLegend}
                    onChange={(e) => setTempLegend(e.target.checked)}
                />
            </div>

            {/* OPACITY */}
            <div className="border-b pb-3">
                <OpacitySlider layer="CELLS" />
            </div>

            {/* Cell Scale */}
            <div className=" pb-3 mt-3">

            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500">
                Cell Scale
                </span>

                <span className="text-xs text-gray-600">
                {cellScale}x
                </span>
            </div>

            <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={cellScale}
                // onChange={(e) =>
                //     dispatch(
                //         MapActions.setMapConfig({
                //         mapScale: parseFloat(e.target.value)
                //         })
                //     )
                // }
                onChange={(e) => setCellScale(parseFloat(e.target.value))}
                className="w-full"
            />

            </div>

            {/* <div className="text-xs font-semibold text-gray-500 mb-1">
               Apply Thematic by
            </div> */}
            {/* THEMATIC TYPES */}
            {/* <div className="space-y-2 mb-4">
                {THEMATIC_TYPES.map(thematic  => (
                    <div
                    key={thematic}
                    // onClick={() => setTempType(thematic) }
                    // onClick={() => {
                    //     setTempType(thematic);

                    //     if (thematic === "Technology") {
                    //         setSelectedScheme("Default");
                    //     }
                    // }}
                    onClick={() => {
                        setTempType(thematic);

                        // Reset scheme when switching to Technology
                        if (thematic === "Technology") {
                            setSelectedScheme("Default");
                            setTempColors(FIXED_COLORS.Technology);
                        }

                        // Reset palette for Band
                        if (thematic === "Band") {
                            setSelectedBandPalette("Default");
                            setTempColors(defaultColors.Band);
                        }

                        // Reset palette for Region
                        if (thematic === "Region") {
                            setSelectedRegionPalette("Default");
                            setTempColors(defaultColors.Region);
                        }
                    }}
                    className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-gray-100
                    ${tempType === thematic ? "bg-blue-50 border border-blue-300" : "border border-gray-200"}`}
                    >

                    <span className="text-sm">{thematic}</span>
                    <span className="text-gray-400">›</span>

                    </div>
                ))}
            </div> */}
            <div className="space-y-1 mb-4">  
            {/* reduce from space-y-2 to space-y-1 */}
            {/* {THEMATIC_TYPES.map(thematic => (
                <div
                    key={thematic}
                    onClick={() => {
                        setTempType(thematic);

                        // Reset scheme when switching to Technology
                        if (thematic === "Technology") {
                            setSelectedScheme("Default");
                            setTempColors(FIXED_COLORS.Technology);
                        }

                        // Reset palette for Band
                        if (thematic === "Band") {
                            setSelectedBandPalette("Default");
                            setTempColors(defaultColors.Band);
                        }

                        // Reset palette for Region
                        if (thematic === "Region") {
                            setSelectedRegionPalette("Default");
                            setTempColors(defaultColors.Region);
                        }
                    }}
                    className={`flex justify-between items-center px-3 py-1.5 rounded cursor-pointer hover:bg-gray-100
                    ${tempType === thematic ? "bg-blue-50 border border-blue-300" : "border border-gray-200"}`}
                >
                    <span className="text-sm">{thematic}</span>
                    <span className="text-gray-400">›</span>
                </div>
            ))} */}

            <div className="mb-3">
                <span className="text-xs font-semibold text-gray-500 block mb-1">
                    Apply Thematic by
                </span>
                <select
                    value={tempType}
                    onChange={(e) => {
                        const thematic = e.target.value;
                        setTempType(thematic);
                        if (thematic === "Technology") {
                            setSelectedScheme("Default");
                            setTempColors(FIXED_COLORS.Technology);
                        }
                        if (thematic === "Band") {
                            setSelectedBandPalette("Default");
                            setTempColors(defaultColors.Band);
                        }
                        if (thematic === "Region") {
                            setSelectedRegionPalette("Default");
                            setTempColors(defaultColors.Region);
                        }
                    }}
                    className="w-full border rounded px-2 py-1 text-sm"
                >
                    {THEMATIC_TYPES.map(t => (
                        <option key={t}>{t}</option>
                    ))}
                </select>
            </div>
        </div>

            {/* KPI */}
            {tempType === "KPIs" && (
                <div className="border-t pt-3 space-y-4">

                    {/* Date/Time */}
                    <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 mb-1">
                        Start: Date/Time
                        </label>

                        <input
                        type="datetime-local"
                        value={kpiStartDateTime}
                        onChange={(e) => setKpiStartDateTime(e.target.value)}
                        className="border rounded px-2 py-1 text-xs w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-500 mb-1">
                        End: Date/Time
                        </label>

                        <input
                        type="datetime-local"
                        value={kpiEndDateTime}
                        onChange={(e) => setKpiEndDateTime(e.target.value)}
                        className="border rounded px-2 py-1 text-xs w-full"
                        />
                    </div>
                    </div>

                    {/* KPI Selection */}
                    <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                        Select KPI
                    </div>

                    <select
                        value={selectedKpi}
                        onChange={(e) => setSelectedKpi(e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                    >
                        {kpiThematicOptions.map((kpi) => (
                        <option key={kpi}>{kpi}</option>
                        ))}
                    </select>
                    </div>

                    {/* Range Filters */}
                    {/* <div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">
                        Range Filter
                        </span>

                        <button
                        onClick={addKpiRange}
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

                    {kpiRanges.map((range, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Min"
                            value={range.min}
                            onChange={(e) =>
                                updateKpiRange(index, "min", e.target.value)
                            }
                            onBlur={() => handleRangeBlur(index)}
                            className="border rounded px-2 py-1 w-20 text-sm"
                        />

                        <input
                            type="number"
                            step="0.01"
                            placeholder="Max"
                            value={range.max}
                            onChange={(e) =>
                                updateKpiRange(index, "max", e.target.value)
                            }
                            onBlur={() => handleRangeBlur(index)}
                            className="border rounded px-2 py-1 w-20 text-sm"
                        />

                        <ColorPicker
                            value={range.color}
                            onChange={(color) =>
                            updateKpiRange(index, "color", color)
                            }
                        />

                        {kpiRanges.length > 1 && (
                            <button
                            onClick={() => removeKpiRange(index)}
                            className="text-red-500 text-sm"
                            >
                            ✕
                            </button>
                        )}
                        </div>
                    ))}
                    </div> */}

                    {/* Mode Toggle */}
                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Mode
                    </div>
                    <div className="flex gap-2 mb-3">
                        {["Default", "Custom"].map(mode => (
                            <button
                                key={mode}
                                onClick={() => {
                                    setKpiMode(mode);
                                    if (mode === "Default") {
                                        setKpiRanges(deepCopyRanges(KPI_RANGE_DEFAULTS[selectedKpi]));
                                    }
                                }}
                                className={`flex-1 px-3 py-1 rounded text-sm border ${
                                    kpiMode === mode
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-600 border-gray-300"
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Default Preview */}
                    {kpiMode === "Default" && (
                        <div className="border rounded p-2 mb-3">
                            <div className="text-xs font-semibold text-gray-500 mb-2">
                                Preview
                            </div>
                            <div className="space-y-1">
                                {(KPI_RANGE_DEFAULTS[selectedKpi] || []).map((range, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <div
                                            className="w-3 h-3 rounded-sm flex-shrink-0"
                                            style={{ backgroundColor: range.color }}
                                        />
                                        <span className="text-gray-600">{range.label}</span>
                                        <span className="text-gray-400 ml-auto">
                                            {range.max} to {range.min}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Custom Range Filter */}
                    {kpiMode === "Custom" && (
                        <RangeFilter
                            value={kpiRanges}
                            onChange={setKpiRanges}
                        />
                    )}
                </div>
            )}

            {/* TECHNOLOGY Thematics*/}
            {/* {tempType  === "Technology" && (
            <div className="border-t pt-3">
                {Object.keys(techGrouped).map(tech => (
                <div
                    key={tech}
                    className="flex justify-between items-center mb-2"
                >
                    <span className="text-sm">{tech}</span>
                    <ColorPicker
                        value={tempColors[tech] || defaultColors.Technology?.[tech] || "#2563eb"}
                        onChange={(color) =>
                            handleColorChange(tech, color)
                        }
                    />
                </div>
                ))}
            </div>
            )} */}

            {tempType === "Technology" && (
                <div >

                    {/* Selected Colors Preview COLORS */}
                    {/* COLOR SCHEMES */}
                    <div className="border-t pt-2 mb-3">

                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Color Schemes
                    </div>

                    {Object.keys(TECHNOLOGY_SCHEMES).map((scheme) => (

                        <label
                        key={scheme}
                        className="flex items-center justify-between mb-2 cursor-pointer"
                        >

                        <div className="flex items-center gap-2">

                            <input
                            type="radio"
                            name="tech-scheme"
                            checked={selectedScheme === scheme}
                            onChange={() => applyTechnologyScheme(scheme)}
                            />

                            <span className="text-sm">{scheme}</span>

                        </div>

                        {/* Preview */}
                        <div className="flex gap-1">

                            {Object.values(TECHNOLOGY_SCHEMES[scheme]).map((color, i) => (

                            <div
                                key={i}
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color }}
                            />

                            ))}

                        </div>

                        </label>

                    ))}

                    </div>

                    {/* PREVIEW */}
                    <div className="border-t pt-3 mb-3">

                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Preview
                    </div>

                    <div className="flex gap-4 text-xs">

                        {["2G","3G","4G","5G"].map((tech) => (

                        <div key={tech} className="flex items-center gap-1">

                            <span>{tech}</span>

                            <div
                            className="w-4 h-4 rounded"
                            style={{
                                backgroundColor:
                                tempColors[tech] ||
                                TECHNOLOGY_SCHEMES[selectedScheme]?.[tech] ||
                                FIXED_COLORS.Technology?.[tech]
                            }}
                            />

                        </div>

                        ))}

                    </div>

                    </div>

                    {/* MANUAL OVERRIDE */}
                    <div className="border-t pt-2">

                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Customize
                    </div>

                    {Object.keys(techGrouped).map((tech) => (
                        <div
                        key={tech}
                        className="flex justify-between items-center mb-2"
                        >
                        <span className="text-sm">{tech}</span>

                        <ColorPicker
                            value={
                            tempColors[tech] ||
                            defaultColors.Technology?.[tech] ||
                            "#2563eb"
                            }
                            onChange={(color) =>
                            handleColorChange(tech, color)
                            }
                        />
                        </div>
                    ))}

                    </div>

                </div>
            )}

            {/* BAND Thematics*/}
            {tempType  === "Band" && (
                <div >
                     {/* PALETTE */}
                    <div className="border-t pt-2 mb-3">

                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Palette
                    </div>

                    {Object.keys(COLOR_SCHEMES).map((palette) => (

                        <label
                        key={palette}
                        className="flex items-center justify-between mb-2 cursor-pointer"
                        >

                        <div className="flex items-center gap-2">

                            <input
                            type="radio"
                            name="band-palette"
                            checked={selectedBandPalette === palette}
                            onChange={() => applyBandPalette(palette)}
                            />

                            <span className="text-sm">{palette}</span>

                        </div>

                        <div className="flex gap-1">

                            {COLOR_SCHEMES[palette].slice(0,4).map((color,i)=>(

                            <div
                                key={i}
                                className="w-4 h-4 rounded"
                                style={{backgroundColor:color}}
                            />

                            ))}

                        </div>

                        </label>

                    ))}

                    </div>

                    {/* PREVIEW */}
                    {/* <div className="border-t pt-3 mb-3">

                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            Preview
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs">
                            {Object.entries(defaultColors.Band).map(([band,color]) => (
                                <div key={band} className="flex items-center gap-1">
                                    <span>{band}</span>
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{
                                            backgroundColor:
                                            tempColors[band] || color
                                    }}
                                    />
                                </div>
                            ))}
                        </div>

                    </div> */}

                    {/* PREVIEW */}
                    <div className="border-t pt-3 mb-3">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            Preview
                        </div>

                        <div className="max-h-[150px] overflow-y-auto grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            {Object.entries(defaultColors.Band).map(([band, color]) => (
                                <div key={band} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-sm flex-shrink-0"
                                        style={{
                                            backgroundColor: tempColors[band] || color
                                        }}
                                    />
                                    <span className="truncate">{band}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MANUAL OVERRIDE */}
                    <div className="border-t pt-2">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            Customize
                        </div>

                        <div className="max-h-[200px] overflow-y-auto"> 
                            {Object.entries(techGrouped).map(([tech, bands]) => (
                                <div key={tech} className="mb-3">
                                    <div className="font-semibold text-sm mb-1">
                                        {tech}
                                    </div>

                                    {bands.map(band => (
                                        <div
                                            key={band}
                                            className="flex justify-between items-center mb-1"
                                        >
                                            <span className="text-sm">{band}</span>
                                            {/* <input
                                                type="color"
                                                className="w-5 h-5 cursor-pointer"
                                                value={tempColors[band] || defaultColors.Band?.[band] || "#22c55e"}                           
                                                onChange={(e) =>
                                                handleColorChange(band, e.target.value)
                                                }
                                            /> */}
                                            <ColorPicker
                                                value={tempColors[band] || defaultColors.Band?.[band] || "#22c55e"}
                                                onChange={(color) =>handleColorChange(band, color)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* REGION Thematics*/}
            {tempType  === "Region" && (
                <div>
                    {/* PALETTE */}
                    <div className="border-t pt-2 mb-3">

                    <div className="text-xs font-semibold text-gray-500 mb-2">
                        Palette
                    </div>

                    {Object.keys(COLOR_SCHEMES).map((palette) => (

                        <label
                        key={palette}
                        className="flex items-center justify-between mb-2 cursor-pointer"
                        >

                        <div className="flex items-center gap-2">

                            <input
                            type="radio"
                            name="region-palette"
                            checked={selectedRegionPalette === palette}
                            onChange={() => applyRegionPalette(palette)}
                            />

                            <span className="text-sm">{palette}</span>

                        </div>

                        <div className="flex gap-1">

                            {COLOR_SCHEMES[palette].slice(0,4).map((color,i)=>(

                            <div
                                key={i}
                                className="w-4 h-4 rounded"
                                style={{backgroundColor:color}}
                            />

                            ))}

                        </div>

                        </label>

                    ))}

                    </div>

                    {/* PREVIEW */}
                    <div className="border-t pt-3 mb-3">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            Preview
                        </div>

                        <div className="max-h-[150px] overflow-y-auto overflow-x-hidden">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs"> 
                                {regions.map((region) => (
                                    <div key={region.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-sm flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    tempColors[region.name] ||
                                                    defaultColors.Region?.[region.name]
                                            }}
                                        />
                                        <span className="break-words">{region.name}</span>
                                    </div>
                                ))}
                           </div>
                        </div>
                    </div>

                    {/* MANUAL OVERRIDE */}
                    <div className="border-t pt-2">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            Customize
                        </div>

                        <div className="max-h-[200px] overflow-y-auto">
                            {regions.map((region) => (
                            <div
                                key={region.indexi}
                                className="flex justify-between items-center mb-2"
                            >
                                <span className="text-sm">{region.name}</span>
                                {/* <input
                                type="color"
                                className="w-6 h-6 cursor-pointer"
                                // value={tempColors[region.name] || "#f59e0b"}
                                value={tempColors[region.name] || defaultColors.Region?.[region.name] || "#f59e0b"}
                                onChange={(e) =>
                                    handleColorChange(region.name, e.target.value)
                                }
                                /> */}

                                <ColorPicker
                                    value={tempColors[region.name] || defaultColors.Region?.[region.name] || "#f59e0b"}
                                    onChange={(color) => handleColorChange(region.name, color)}
                                />
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        {/* </div> */}

        {/* )} */}

    </div>
    );
};

export default CellThematicsPanel;