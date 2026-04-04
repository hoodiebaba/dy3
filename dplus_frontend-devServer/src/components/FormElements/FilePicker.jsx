
import React from 'react';


const FilePicker = ({ itm, errors, handleSubmit, setValue, getValues, register }) => {

    return <>
        <input type={itm.type}
            multiple={itm?.multiple ? true : false}
            {...register(itm.name,
                {
                    required: itm.required ? "This " + " Field is required" : false,
                    ...itm.props
                }
            )}
            className=" block w-full text-sm text-black border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-white dark:border-black dark:placeholder-black"
            {...itm.props} />
        {console.log(errors, [itm.name], itm.required, "errors?.itm?")}
        <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
    </>
};

export default FilePicker;
