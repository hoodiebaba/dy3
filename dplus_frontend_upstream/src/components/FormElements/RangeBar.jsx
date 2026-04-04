
import React from 'react';


const RangeBar = ({ itm, errors, handleSubmit, setValue, getValues, register }) => {

    return <>
        <input type={"range"}
            disabled={itm.disabled ? true : false}
            {...register(itm.name, {
                required: itm.required ? "This " + " Field is required" : false,
                ...itm.props
            })}

            // value={getValues(itm.name)}
            min={1}
            max={100}
            onChange={(e) => {
                console.log(itm.name,e.target.value,"itm.name","rangebar")
                setValue(itm.name, e.target.value)
            }}
            placeholder={itm.placeholder ? itm.placeholder : ""}
            className="text-red-800 bg-white block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6" {...itm.props} />
        {console.log(errors, [itm.name], itm.required, "errors?.itm?")}
        <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
    </>
};

export default RangeBar;
