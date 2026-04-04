import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapActions from "../../store/actions/map-actions";
import AuthActions from "../../store/actions/auth-actions";

const LeftFilters = () => {
  const dispatch = useDispatch();

  const allFilters = useSelector(state => state.map.telecomFilterMeta);
  const mapConfig = useSelector(state => state.map.config);
  const activeThematic = useSelector(state => state.map.activeThematic);

  const [selected, setSelected] = useState({});
  const [showLeftFilters, setShowLeftFilters] = useState(false);
  const [openTech, setOpenTech] = useState({});
  const [openGroup, setOpenGroup] = useState({});
  const [siteSearch, setSiteSearch] = useState("");

  const toggleTech = (name) => {
    setOpenTech(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleGroup = (name) => {
    setOpenGroup(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleCheck = (parent, value) => {
    setSelected(prev => {
      const existing = prev[parent] || [];
      if (existing.includes(value)) {
        return { ...prev, [parent]: existing.filter(v => v !== value) };
      }
      return { ...prev, [parent]: [...existing, value] };
    });
  };

  const handleSubmit = () => {
    const payload = { ...selected };

    if (siteSearch.trim()) {
      payload.site_name = [siteSearch.trim()];
    }

    dispatch(MapActions.getMultiVendorCells(payload));

    dispatch(AuthActions.setupConf(true, {
      mapScale: mapConfig.mapScale,
      mapView: mapConfig.mapView,
      saveMapFilters: JSON.stringify(payload),
      saveThematics: JSON.stringify(activeThematic)
    }));

    setShowLeftFilters(false);
  };

  const clearGlobalFilters = () => {
    setSelected({});
    setSiteSearch("");

    dispatch(MapActions.getMultiVendorCells({}));
  };
  
  useEffect(() => {
    if (allFilters?.d1) {
      const initial = {};
      allFilters.d1.forEach(g => {
        initial[g.parent] = true;
      });
      setOpenGroup(initial);
    }
  }, [allFilters]);

return (
  <div className="relative">
    <button
      onClick={() => setShowLeftFilters(prev => !prev)}
      className="px-4 py-2 bg-[#162a52] hover:bg-[#1e3a70] text-white text-sm rounded-lg border border-[#2c4a85]"
    >
      Filters ☰
    </button>

    {showLeftFilters && (
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-full mt-2 bg-white text-black p-4 rounded-xl shadow-xl z-50 w-[280px] sm:w-[320px] max-w-[90vw] max-h-[70vh] overflow-y-auto"
      >
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-1 rounded"
          >
            Apply
          </button>
          <button
            onClick={() => { clearGlobalFilters(); setShowLeftFilters(false); }}
            className="flex-1 bg-gray-400 text-white py-1 rounded"
          >
            Clear
          </button>
        </div>

        {allFilters?.d1?.map((group, groupIndex) => (
          <div key={groupIndex} className="border rounded p-2 mb-2">

            <div
              className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
              onClick={() => toggleGroup(group.parent)}
            >
              <span className="font-medium">{group.parent}</span>
              <span className="text-sm select-none">
                {openGroup[group.parent] ? "▲" : "▼"}
              </span>
            </div>

            {openGroup[group.parent] && (
              <div className="mt-2 border rounded p-2">
                {group.child?.map((techBlock, techIndex) => {

                  const isTechSelected =
                    selected[techBlock.name]?.length ===
                    techBlock.columnName?.length;

                  return (
                    <div key={techIndex} className="mb-3">

                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded p-1"
                        onClick={() => toggleTech(techBlock.name)}
                      >
                        <label
                          className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isTechSelected}
                            onChange={() => {
                              const allBands = techBlock.columnName.map(b => b.name);
                              setSelected(prev => ({
                                ...prev,
                                [techBlock.name]: isTechSelected ? [] : allBands
                              }));
                            }}
                          />
                          {techBlock.name}
                        </label>
                        <span className="text-xs select-none">
                          {openTech[techBlock.name] ? "▲" : "▼"}
                        </span>
                      </div>

                      {openTech[techBlock.name] && (
                        <div className="mt-2 max-h-[200px] overflow-y-auto border rounded p-2">
                          {techBlock.columnName?.map((band, bandIndex) => (
                            <label
                              key={bandIndex}
                              className="flex items-center gap-2 text-sm mb-1 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selected[techBlock.name]?.includes(band.name) || false}
                                onChange={() => handleCheck(techBlock.name, band.name)}
                              />
                              {band.name}
                            </label>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default LeftFilters;

      
        {/* LEft filters */}
      //  <div className="flex items-center gap-2 sm:gap-3">
      //     {/* LEFT FILTERS PANEL (Technology & Region Data Filters */}
      //     {showLeftFilters && (
      //     <div className="absolute left-0 top-full mt-2 w-[300px] bg-[#0b1c38] p-4 
      //       rounded-xl shadow-xl border border-[#2c4a85] z-50 max-h-[80vh] 
      //       overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">              
      //         {/* Close */}
      //         <button
      //            onClick={() => setShowLeftFilters(false)}
      //           className="absolute top-1 right-2 text-white text-lg"
      //         >
      //           ✕
      //         </button>

      //         <div className="flex flex-col gap-3 mt-4">

      //           {/* Actions */}
      //           <div className="sticky bottom-0 bg-[#0b1c38] pt-3 flex gap-2">
      //             <button
      //               onClick={clearGlobalFilters}
      //               className="bg-gray-500 px-3 py-2 rounded-lg text-sm"
      //             >
      //               Clear
      //             </button>

      //             <button
      //               onClick={handleSubmit}
      //               className="bg-blue-600 px-3 py-2 rounded-lg text-sm"
      //             >
      //               Apply
      //             </button>
      //           </div>

      //           {allFilters?.d1?.map((group, groupIndex) => (
      //             <div key={groupIndex}>

      //               {/* Group Title */}
      //               <div
      //                 className="flex items-center justify-between text-white font-semibold mb-2 cursor-pointer"
      //                 onClick={() => toggleGroup(group.parent)}
      //               >
      //                 <span>{group.parent}</span>
      //                 <span className="text-xs">
      //                   {openGroup[group.parent] ? "▲" : "▼"}
      //                 </span>
      //               </div>
                    
      //               {/* Accordion */}
      //               {openGroup[group.parent] && 
      //                 group.child?.map((techBlock, techIndex) => {
      //                 const isTechSelected =
      //                   selected[techBlock.name]?.length ===
      //                   techBlock.columnName?.length;

      //                 return (
      //                   <div key={techIndex} className="mb-3 bg-[#162a52] p-3 rounded-lg">

      //                     {/* Parent */}
      //                     <div
      //                       className="flex items-center justify-between text-white font-medium cursor-pointer"
      //                       onClick={() => toggleTech(techBlock.name)}
      //                     >
      //                       <label
      //                         className="flex items-center gap-2 cursor-pointer"
      //                         onClick={(e) => e.stopPropagation()}
      // >                            <input
      //                             type="checkbox"
      //                             checked={isTechSelected}
      //                             onChange={() => {
      //                               const allBands =
      //                                 techBlock.columnName.map(b => b.name);
      //                               setSelected(prev => ({
      //                                 ...prev,
      //                                 [techBlock.name]:
      //                                   isTechSelected ? [] : allBands
      //                               }));
      //                             }}
      //                           />
      //                           {techBlock.name}
      //                       </label>

      //                       <span className="text-xs">
      //                         {openTech[techBlock.name] ? "▲" : "▼"}
      //                       </span>

      //                     </div>

      //                     {/* Children */}
      //                     {openTech[techBlock.name] && (
      //                       <div className="pl-4 mt-2 space-y-1">
      //                       {techBlock.columnName?.map((band, bandIndex) => (
      //                         <label
      //                           key={bandIndex}
      //                           className="flex items-center gap-2 text-sm text-white"
      //                         >
      //                           <input
      //                             type="checkbox"
      //                             checked={
      //                               selected[techBlock.name]?.includes(band.name) || false
      //                             }
      //                             onChange={() =>
      //                               handleCheck(techBlock.name, band.name)
      //                             }
      //                           />
      //                           {band.name}
      //                         </label>
      //                       ))}
      //                     </div>
      //                     )}
      //                   </div>
      //                 );
      //               })}
      //             </div>
      //           ))}

      //         </div>
      //       </div>
      //     )}
      //   </div>

      //   <button
      //     onClick={() => setShowLeftFilters(true)}
      //     className="px-4 py-2 bg-[#162a52] hover:bg-[#1e3a70] text-white text-sm rounded-lg border border-[#2c4a85]"
      //   >
      //     Filters ☰
      //   </button>

