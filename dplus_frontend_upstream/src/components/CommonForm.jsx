import Multiselect from 'multiselect-react-dropdown';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import TextBox from './FormElements/TextBox';
import FilePicker from './FormElements/FilePicker';
import SelectDropDown from './FormElements/SelectDropDown';
import TextArea from './FormElements/TextArea';
import Multiselection from './FormElements/Multiselection';
import DatePicking from './FormElements/DatePicking';
import AutoSuggestion from './FormElements/AutoSuggestion';
import RangeBar from './FormElements/RangeBar';
import Password from './FormElements/Password';


const CommonForm = ({ classes, encType = false, Form, errors, handleSubmit, setValue, getValues, register }) => {

    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(true);

    console.log(Form,"FormFormFormFormFormFormForm")

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

    let types = ["text", "email", "hidden", "number"]


    let uiList = {
        "text": {
            "height": "h-[40px]"
        },
        "file": {
            "height": "h-[40px]"
        },
        "password": {
            "height": "h-[40px]"
        },
        "number": {
            "height": "h-[40px]"
        },
        "email": {
            "height": "h-[40px]"
        },
        "hidden": {
            "height": "h-[40px]"
        },
        "select": {
            "height": "h-[40px]"
        },
        "datetime": {
            "height": "h-[40px]"
        },
        "muitiSelect": {
            "height": "h-[40px]"
        },
        "rangeBar": {
            "height": "h-[40px]"
        },
        


        "textarea": {
            "height": "h-[200px]"
        }
    }
    // console.log(Form, "Form")
    return (
        <form className={"grid " + classes} encType="multipart/form-data">

            {/* {console.log(errors, "errors")} */}
            {
                Form.map((itm, i) => {
                    // { console.log(itm, "itmnewitmnewitm") }

                    return (
                        <div key={i} className={itm.classes ? itm.classes : "col-span-1"}>
                            <div className="items-center justify-between">
                                {
                                    itm.type != "hidden" ? <label className={`block text-sm font-medium  ${itm.lclasses?itm.lclasses:" text-black  dark:text-black "}`}>{itm.label}</label> : <></>
                                }

                            </div>
                            <div className={uiList[itm.type]["height"] + " mt-2"}>
                                {
                                    types.indexOf(itm.type) != -1 ?
                                        <>
                                            <TextBox itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "password" ?
                                        <>
                                            <Password itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </>
                                        :
                                        <></>
                                }

                                {
                                    itm.type == "rangeBar" ?
                                        <>
                                            <RangeBar itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </>
                                        :
                                        <></>
                                }

                                
                                {
                                    itm.type == "file" ?
                                        <>
                                            <FilePicker itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />

                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "select" ?

                                        <>
                                            <SelectDropDown itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "autoSuggestion" ?

                                        <>
                                            <AutoSuggestion itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    itm.type == "textarea" ?
                                        <>
                                            <TextArea itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
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
                                            <DatePicking itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        </> :
                                        <></>
                                }
                                {
                                    itm.type == "muitiSelect" ?
                                        <Multiselection itm={itm} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                                        :
                                        <></>
                                }


                                {/* {console.log(errors, "errorsendDateendDate")} */}

                            </div>

                        </div>
                    )
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
    )
};

export default CommonForm;