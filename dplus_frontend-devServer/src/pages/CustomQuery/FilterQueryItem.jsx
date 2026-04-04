import React, { useEffect, useState } from 'react';

import * as Unicons from '@iconscout/react-unicons';


const FilterQueryItem = ({ filtering, SetgOpen, gopen, setDataValue, dataValue, itm, value, size, classname = "text-black" }) => {

    const sizeArr = ["text-[16px]", "text-[14px]", "text-[12px]", "text-[10px]", "text-[8px]", "base"]
    const [open, SetOpen] = useState(false)
    const [fakeOpen, setfakeOpen] = useState(false)









    console.log(filtering, SetgOpen, gopen, setDataValue, dataValue, itm, value, size, "filtering, SetgOpen, gopen, setDataValue, dataValue, itm, value, size")
    const onChangeData = (parent, target, value, label, parent_l) => {


        console.log("onChangeData", parent, target, value, label)

        if (target) {

            if (gopen.indexOf(parent_l) == -1) {
                gopen.push(parent_l)
            }

            setDataValue(prev => {

                console.log(prev[parent] + [label], "hasgjdaskl")
                return {
                    ...prev,
                    [parent]: prev[parent] != undefined ? [...prev[parent], label] : [label]
                }
                return prev[parent] == undefined ? prev[parent] + [label] : prev[parent]


                return prev
            });
        } else {
            console.log("hasgjdaskl")
            setDataValue(prev => {
                console.log(prev[parent].filter(item => item !== label), "hasgjdaskl")
                return {
                    ...prev,
                    [parent]: prev[parent].filter(item => item !== label)
                }
            })

            setDataValue(prev => {
                const { [itm.name]: deletedKey, ...rest } = prev;

                console.log(prev[itm.name].length > 0, "[itm.name]")

                if (prev[itm.name] == undefined || prev[itm.name].length == 0) {

                    SetgOpen(prev => prev.filter(item => item !== parent_l));
                }


                return prev[itm.name].length > 0 ? prev : rest;
            });
        }

    }

    // dataValue[itm.name] = []


    const onChangeHeadData = (stchjanger, collist, checked, value) => {
        if (checked) {
            SetgOpen(prev => [...prev, stchjanger]);

            let dte = itm["name"];
            console.log(dte, collist.map(item => item.name), "dtedtedtedtedte");

            setDataValue(prev => ({
                ...prev,
                [itm.name]: collist.map(item => item.name),
            }));
        } else {
            SetgOpen(prev => prev.filter(item => item !== stchjanger));

            setDataValue(prev => {
                const { [itm.name]: deletedKey, ...rest } = prev;
                return rest;
            });
        }
    };



    const on = (stchjanger, collist, checked, value) => {
        return <></>
    };







    return <>

        {
            itm?.columnName?.length ?
                <>
                    <div className="pl-2 flex">

                        <input type={"checkbox"} value={itm.index} {...(gopen.indexOf("ind_" + itm.index) !== -1 ? { checked: true } : { checked: false })} onChange={({ target: { checked, value } }) => { onChangeHeadData("ind_" + itm.index, itm.columnName, checked, value) }} />
                        <button onClick={((prev) => { SetOpen(!open), console.log(!open) })} type="button" class={"pl-2 flex items-center w-full p-2 text-base font-normal transition duration-75 rounded-lg group dark:text-black " + classname} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            {1 == 1 ? <span class={sizeArr[size] + " flex-1 ml-3 text-left whitespace-nowrap"} sidebar-toggle-item>{itm.name}</span> : ""}
                            {open ? <Unicons.UilAngleUp /> : <Unicons.UilAngleDown />}
                        </button>

                    </div>
                </> : <></>

        }
        {/* {


            itm.columnName && itm.columnName.length > 0 && open ?
                <div className="pl-5 flex items-center w-full p-2 first-letter dark:text-white">{1 == 1 ? <span class={"text-" + sizeArr[size + 1] + " pl-3 text-base font-normal text-gray-900 transition duration-75 rounded-lg group dark:text-black"}>{"Select All"}</span> : <></>}</div> : ""
        } */}

        {


            (itm?.columnName?.length && open) ?

                <ul id="dropdown-example" class="py-2 pl-3 space-y-2">
                    {
                        itm.columnName.map((nestItm) => {
                            console.log(nestItm, 'all items---')

                            console.log("dataValueaass 77", dataValue[itm?.name]?.map(item => {
                                return ["itme", item, "nesting", nestItm.name]
                            }))

                            console.log("dataValueaass 81", dataValue,gopen,itm?.name,nestItm.name)
                            console.info("nestItm => ", dataValue[itm?.name], nestItm, itm, gopen)
                            return <div className="pl-2 flex items-center w-full p-2 first-letter dark:text-white">
                                <input
                                    type="checkbox"
                                    {...(dataValue[itm?.name]?.indexOf(nestItm.name) !== -1 && dataValue[itm?.name]?.indexOf(nestItm.parentName) !== undefined ? { checked: true } : { checked: false })}
                                    value={nestItm.index}
                                    onChange={((e) => {
                                        onChangeData(itm?.name, e.target.checked, e.target.value, nestItm.name, "ind_" + itm.index)
                                    })} />
                                <span 
                                    style={{backgroundColor:nestItm?.bgColor,color:nestItm?.textColor,padding:'0px 4px',marginLeft:'2px'}}
                                    class={sizeArr[size + 1] + " pl-3 font-normal transition duration-75 rounded-lg group dark:text-black " + classname}>{nestItm.name}</span></div>
                        })
                    }
                </ul> : <></>
        }
    </>
}

export default FilterQueryItem