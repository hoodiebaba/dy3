
import React, { useState } from 'react';
import { UilEye,UilEyeSlash } from '@iconscout/react-unicons'


const Password = ({ itm, errors, handleSubmit, setValue, getValues, register }) => {


    const [view,setView] = useState(true)
    return <>
        <div className='flex relative'>
            <input type={view?"password":"text"}
                disabled={itm.disabled ? true : false}
                {...register(itm.name, {
                    required: itm.required ? "This " + " Field is required" : false,
                    ...itm.props
                })}
                placeholder={itm.placeholder ? itm.placeholder : ""}
                className=" bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...itm.props} />
            {console.log(errors, [itm.name], itm.required, "errors?.itm?")}


            <span onClick={()=>{
                setView(prev=>!prev)
            }} className='absolute right-2 top-1 bottom-1 my-auto'>
            {view?<UilEye/>:<UilEyeSlash/>}
            </span>

            
        </div>
        <p className='text-xs text-red-700'>{errors[itm.name]?.message}</p>
    </>
};

export default Password;
