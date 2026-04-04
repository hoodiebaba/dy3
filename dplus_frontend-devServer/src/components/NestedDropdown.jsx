import React, { useEffect, useState } from 'react';

import * as Unicons from '@iconscout/react-unicons';


const NestedDropdown = ({ filtering, SetgOpen, gopen, setDataValue, dataValue, itm, value, size=0, ns = 0, parentation = {} }) => {

    const sizeArr = ["lg",  "base","sm", "xs"]
    const [open, SetOpen] = useState(false)
    const [fakeOpen, setfakeOpen] = useState(false)


    console.log(dataValue, "dataValuedataValue", gopen, "dataValuedataValue")
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
            setDataValue(prev => {
                return {
                    ...prev,
                    [parent]: prev[parent].filter(item => item !== label)
                }
            })

            setDataValue(prev => {
                const { [itm.link]: deletedKey, ...rest } = prev;


                if (prev[itm.link] == undefined || prev[itm.link].length == 0) {

                    SetgOpen(prev => prev.filter(item => item !== parent_l));
                }


                return prev[itm.link].length > 0 ? prev : rest;
            });
        }

    }

    // dataValue[itm.name] = []


    const onChangeHeadData = (stchjanger, collist, checked, value, parentt = itm) => {

        console.log("onChangeHeadData", stchjanger, collist, checked, value)


        if (checked) {
            SetgOpen(prev => [...prev, stchjanger]);

            let dte = parentt["link"];

            setDataValue(prev => ({
                ...prev,
                [parentt.link]: collist.map(item => item.link),
            }));



            collist.map(
                item => {
                    if (item.subMenu.length > 0) {
                        onChangeHeadData("ind_" + item.link, item.subMenu, checked, item.link, item)
                    }
                }
            )
        } else {
            SetgOpen(prev => prev.filter(item => item !== stchjanger));

            setDataValue(prev => {
                const { [parentt.link]: deletedKey, ...rest } = prev;
                return rest;
            });

            collist.map(
                item => {
                    if (item.subMenu.length > 0) {
                        onChangeHeadData("ind_" + item.link, item.subMenu, checked, item.link, item)
                    }
                }
            )
        }
    };


    // const parent = (linking, subMenu, name) => {
    //     return <>
    //         <div className="pl-2 flex">

    //             <input
    //                 type={"checkbox"}
    //                 value={linking}

    //                 {...(dataValue[linking] ? { checked: true } : { checked: false })}

    //                 onChange={({ target: { checked, value } }) => {
    //                     onChangeHeadData("ind_" + linking, subMenu, checked, value)
    //                     if (ns == 1) {
    //                         console.log(parentation, "parentationparentationparentation")
    //                         onChangeData(parentation.link, subMenu, checked, value, "ind_" + linking)
    //                     }

    //                 }} />
    //             <button onClick={((prev) => {
    //                 SetOpen(!open),
    //                     console.log(!open)
    //             })}
    //                 type="button"
    //                 class={"pl-2 flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group dark:text-black"}
    //                 aria-controls="dropdown-example"
    //                 data-collapse-toggle="dropdown-example">
    //                 {1 == 1 ? <span class={"text-" + sizeArr[size] + " flex-1 ml-3 text-left whitespace-nowrap"} sidebar-toggle-item>{name}</span> : ""}
    //                 {open ? <Unicons.UilAngleUp /> : <Unicons.UilAngleDown />}
    //             </button>
    //         </div>
    //     </>
    // }

    const parent = (linking, subMenu, name) => {
        return <>
            <div className="h-14 flex w-full items-center">

                <input 
                    type={"checkbox"} 
                    className='pt-0.5'
                    value={linking} {...(dataValue[linking] ? { checked: true } : { checked: false })} onChange={({ target: { checked, value } }) => {
                        onChangeHeadData("ind_" + linking, subMenu, checked, value)
                        if (ns == 1) {
                            console.log(parentation, "parentationparentationparentation")
                            onChangeData(parentation.link, subMenu, checked, value, "ind_" + linking)
                        }
                    }} 
                />


                <button onClick={((prev) => {SetOpen(!open),console.log(!open)})} type="button" class={"flex  w-full justify-between items-center"} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example"> 
                    {1 == 1 ? <span class={"text-" + sizeArr[size] + " p-2 pt-3.4"} sidebar-toggle-item>{name}</span> : ""}
                    {open ? <Unicons.UilAngleUp /> : <Unicons.UilAngleDown />}
                </button>
            </div>
        </>
    }


    const child = (linking, clink, cname,sizing) => {
        return <div className=" h-14 flex w-full items-center">
            {/* {console.log(dataValue[linking] ? dataValue[linking].indexOf(nestItm.link) !== -1 : false, dataValue[linking], nestItm.link, "dataValue[itm?.link]?.indexOf(nestItm.link)")} */}
            <input type="checkbox" {...(dataValue[linking] ? dataValue[linking].indexOf(clink) !== -1 ? { checked: true } : { checked: false } : { checked: false })} value={clink} onChange={((e) => {
                onChangeData(linking, e.target.checked, e.target.value, clink, "ind_" + linking)
            })} />
            <span class={"text-" + sizeArr[sizing] + " p-2 pt-3 w-full"}>{cname}</span></div>
    }

    // const child = (linking, clink, cname,sizing) => {
    //     return <div className="pl-2 flex items-center w-full p-2 first-letter dark:text-white">
    //         {/* {console.log(dataValue[linking] ? dataValue[linking].indexOf(nestItm.link) !== -1 : false, dataValue[linking], nestItm.link, "dataValue[itm?.link]?.indexOf(nestItm.link)")} */}
    //         <input type="checkbox" {...(dataValue[linking] ? dataValue[linking].indexOf(clink) !== -1 ? { checked: true } : { checked: false } : { checked: false })} value={clink} onChange={((e) => {
    //             onChangeData(linking, e.target.checked, e.target.value, clink, "ind_" + linking)
    //         })} />
    //         <span class={"text-" + sizeArr[sizing] + " pl-5 text-base font-normal text-gray-900 transition duration-75 rounded-lg group dark:text-black"}>{cname}</span></div>
    // }

    return <>


        {/* {


            itm.columnName && itm.columnName.length > 0 && open ?
                <div className="pl-5 flex items-center w-full p-2 first-letter dark:text-white">{1 == 1 ? <span class={"text-" + sizeArr[size + 1] + " pl-3 text-base font-normal text-gray-900 transition duration-75 rounded-lg group dark:text-black"}>{"Select All"}</span> : <></>}</div> : ""
        } */}

        <div className='flex flex-col'>
            {
                itm?.subMenu?.length > 0 ?
                    parent(itm.link, itm.subMenu, itm.name) :
                    child(itm.link, itm?.link, itm?.name,size)
            }
            {


                (itm?.subMenu?.length > 0 && open) ?

                    <ul id="dropdown-example" class="py-2 pl-3 space-y-2">
                        {
                            itm.subMenu.map((nestItm) => {
                                return nestItm?.subMenu?.length > 0 ?
                                    <NestedDropdown filtering={filtering} SetgOpen={SetgOpen} gopen={gopen} setDataValue={setDataValue} dataValue={dataValue} itm={nestItm} value={value} size={size+1} ns={1} parentation={itm} /> :
                                    child(itm?.link, nestItm?.link, nestItm?.name,size+2)
                            })
                        }
                    </ul> : <></>
            }

        </div>
    </>
}

export default NestedDropdown