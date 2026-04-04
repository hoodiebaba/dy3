
import React from 'react';


const TextBox = ({ itm,errors, handleSubmit, setValue, getValues, register}) => {

    return <>
        <input type={itm.type}
            disabled={itm.disabled ? true : false}
            {...register(itm.name, {
                required: itm.required ? "This " + " Field is required" : false,
                ...itm.props
            })}
            placeholder={itm.placeholder ? itm.placeholder : ""}
            className=" bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...itm.props} />
        {console.log(errors, [itm.name], itm.required, "errors?.itm?")}
        <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
    </>
};

export default TextBox;
