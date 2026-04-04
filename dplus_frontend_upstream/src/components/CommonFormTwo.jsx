import Multiselect from 'multiselect-react-dropdown';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';


const CommonFormTwo = ({ classes,encType=false, Form, errors, handleSubmit, setValue, getValues, register }) => {

    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(true);

    // let Form = [
    //     { label: "Name", value: "", type: "text" },
    //     { label: "Email", value: "", type: "email" },
    //     { label: "Password", value: "", type: "password" },
    //     { label: "DB Server", value: "", option: ["Abc","bca"], type: "select" }
    // ]

    // let Form = [
    //     { label: "Name", value: "", type: "text" },
    //     { label: "Email", value: "", type: "email" },
    //     { label: "Password", value: "", type: "password" },
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", option: ["Please Select Your DB Server"], type: "textarea" }
    // ]

    let types = ["text", "password", "email", "hidden","number"]


    let uiList = {
        "text": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "file": {
            "height": "h-[40px] w-[200px] max-w-[200px] min-w-[200px]"
        },
        "password": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "number": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "email": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "hidden": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "select": {
            "height": "h-[40px] w-[90px] max-w-[90px] min-w-[90px]"
        },
        "datetime": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "muitiSelect": {
            "height": "h-[40px] w-[80px] max-w-[80px] min-w-[80px]"
        },
        "checkbox": {
            "height": "h-[40px] w-[20px] max-w-[80px] min-w-[20px]"
        },
        

        "textarea": {
            "height": "h-[200px] w-[80px] max-w-[80px] min-w-[80px]"
        }
    }
    // console.log(Form, "Form")
    return <>


        <form className={"grid " + classes} encType="multipart/form-data">

            {/* {console.log(errors, "errors")} */}
            {


                Form.map((itm) => {
                    // { console.log(itm, "itmnewitmnewitm") }

                    return <>

                        <div className={itm.classes ? itm.classes : "flex col-span-1 "}>
                            <div className={`items-center col-span-8 flex align-middle ${itm.type=="file"?" justify-end pl-36":" justify-between"}`}>
                                {
                                    itm.type != "hidden" ? <label className="block text-sm font-medium text-black  dark:text-black">{itm.label}</label> : <></>
                                }

                            </div>
                            <div className={uiList[itm.type]["height"] + " col-span-4"}>
                                {
                                    types.indexOf(itm.type) != -1 ?
                                        <>
                                            <input type={itm.type} {...register(itm.name, {
                                                required: itm.required ? "This " + " Field is required" : false,
                                                ...itm.props
                                            })} className=" bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...itm.props} />
                                            {/* {console.log(errors, [itm.name], itm.required, "errors?.itm?")} */}
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "checkbox" ?
                                        <>
                                            <input type={itm.type} {...register(itm.name, {
                                                required: itm.required ? "This " + " Field is required" : false,
                                                ...itm.props
                                            })} className=" bg-white  block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...itm.props} />
                                            {/* {console.log(errors, [itm.name], itm.required, "errors?.itm?")} */}
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "file" ?
                                        <>
                                            <input type={itm.type}
                                                multiple={itm?.multiple?true:false}
                                                {...register(itm.name,
                                                    {
                                                        required: itm.required ? "This " + " Field is required" : false,
                                                        ...itm.props
                                                    }
                                                )}
                                                className="m-2 block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-white dark:border-black dark:placeholder-black"
                                                {...itm.props} />
                                            {/* {console.log(errors, [itm.name], itm.required, "errors?.itm?")} */}
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "select" ?

                                        <>
                                            <select defaultValue="Select" onChange={itm.onChanging ? itm.onChanging : null}

                                                {...register(itm.name, {
                                                    required: itm.required ? "This " + " Field is required" : false,
                                                    ...itm.props
                                                })} className={"bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"}>

                                                <option value="Select" disabled>Select</option>
                                                {
                                                    itm.option.map((selitm) => {
                                                        return <option
                                                        value={selitm.value}>{selitm.label}</option>
                                                    })
                                                }
                                            </select>
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "textarea" ?
                                        <>
                                            <textarea {...register(itm.name, {
                                                required: itm.required ? "This " + " Field is required" : false,
                                                ...itm.props
                                            })} rows={8} className="bg-white border-black border block w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </> :
                                        <></>
                                }
                                {/* {
                                    itm.type == "datetime" ?
                                        <>
                                            <input type={"datetime-local"} {...register(itm.name, {
                                                required: itm.required ? "This " + " Field is required" : false,
                                                ...itm.props
                                            })} className={"bg-white border-black border block h-8 w-full rounded-md py-0.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"} />
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </> :
                                        <></>
                                } */}
                                {
                                    itm.type == "datetime" ?
                                        <>
                                            <DatePicker
                                                // selected={getValues(itm.name)}
                                                // onChange={(date) => {
                                                //     setValue(itm.name,date)
                                                //     setSelectedDate(prev=>!prev)
                                                // }}

                                                selected={getValues(itm.name) ? moment(getValues(itm.name), itm?.formatop).toDate() : getValues(itm.name)}
                                                onChange={(date) => {

                                                    // console.log(date,getValues(itm.name),"datedatedatedatedate")

                                                    let curr = moment(date)

                                                    // console.log(curr.format(itm?.format),getValues(itm.name),itm?.format,"datedatedatedatedate")
                                                    setValue(itm.name, curr.format(itm?.formatop))
                                                    // console.log(typeof (date), "datedatedatedatedate")

                                                    // console.log(getValues(itm.name) ? moment(getValues(itm.name), itm?.formatop).toDate() : getValues(itm.name), "datedatedatedatedate")



                                                    setSelectedDate(prev => !prev)
                                                }}
                                                showTimeSelect={itm.formattype == "time" || itm.formattype == "datetime"}
                                                showTimeSelectOnly={itm.formattype == "time" || itm.formattype == "datetime"}
                                                show={false}
                                                showIcon={true}
                                                dateFormat={itm?.format}
                                                timeIntervals={itm?.interval}
                                                timeFormat={"HH:mm"}
                                                className='bg-white border-black border block h-8 w-full rounded-md py-0.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                            />
                                            <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
                                        </> :
                                        <></>
                                }
                                {
                                    itm.type == "muitiSelect" ?
                                        <Multiselect
                                            menuIsOpen={true}
                                            keepSearchTerm={true}
                                            groupBy="category"
                                            options={itm.option}
                                            showCheckbox
                                            singleSelect={itm.singleSelect ? itm.singleSelect : false}
                                            selectedValues={[]} // Preselected value to persist in dropdown
                                            // onSelect={() => { }} // Function will trigger on select event
                                            // onRemove={() => { }} // Function will trigger on remove event
                                            {...itm.props}
                                            displayValue={itm.displayValue ? itm.displayValue : "name"}
                                            style={{
                                                searchBox: {
                                                    border: 'none',
                                                    'border-radius': '0px',
                                                    padding: "0px",
                                                    color: "black !important"
                                                }
                                            }}
                                            className='pt-1 text-black bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                        /> :
                                        <></>
                                }


                                {/* {console.log(errors, "errorsendDateendDate")} */}

                            </div>

                        </div>

                    </>





                    //     <div className="mt-2">
                    //         <input id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    //     </div>
                    // </div >
                    // </>
                    // return  <input type={"text"} />
                    // }
                })
            }
        </form>
    </>
};

export default CommonFormTwo;
