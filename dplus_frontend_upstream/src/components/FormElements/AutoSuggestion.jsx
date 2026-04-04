import React, { useState } from 'react';
import DatePicker from 'react-datepicker';


const AutoSuggestion = ({ itm, errors, handleSubmit, setValue, getValues, register }) => {

    console.log("OPTIONS:", itm.option)


    const [value, onChange] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(true);
    return <>



        {/* <input type={itm.type}
            disabled={itm.disabled ? true : false}
            {...register(itm.name, {
                required: itm.required ? "This " + " Field is required" : false,
                ...itm.props
            })}
            placeholder={itm.placeholder ? itm.placeholder : ""}
            className=" bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...itm.props} />


        
        {console.log(errors, [itm.name], itm.required, "errors?.itm?")}
        <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p> */}


        <input
            type={itm.type}
            disabled={itm.disabled ? true : false}
            {...register(itm.name, {
                required: itm.required ? "This Field is required" : false,
                onBlur:itm.onBlur?itm.onBlur:false,
                ...itm.props
            })}
            autoComplete="false"
            defaultValue={itm.defaultValue?itm.defaultValue:""}
            placeholder={itm.placeholder ? itm.placeholder : ""}
            list={itm.datalist ? itm.datalist : ""} // Add list attribute to link to datalist
            className="bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-black-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            {...itm.props}
        />

        {/* Add datalist if itm.datalist exists */}
        {itm.datalist && (
            <datalist id={itm.datalist}>
                {/* Iterate over options and create option elements */}
                {itm.option.map((option, index) => {

                    {/* console.log(option,"optionoptionoptionoptionoption") */}
                    return <option key={option["value"]} value={option["label"]} />
                    // return <option key={index} value={option.label} />
                })}
            </datalist>
        )}
    </>
};

export default AutoSuggestion;
