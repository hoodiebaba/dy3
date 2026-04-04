import React, { useState } from 'react'
import Moreinfo from './Moreinfo'

const ToggleButton = ({ onChange, showinfo = [], defaultChecked, classes = "" }) => {



    const [state, setstate] = useState("")
    const [lclstate, setlclstate] = useState(defaultChecked)

    console.log("lclstate",lclstate,"state",state,"defaultChecked",defaultChecked,"state, setstate")
    if (state != defaultChecked) {
        setstate(defaultChecked)
        setlclstate(defaultChecked)
    }

    return (

        <div className='flex justify-center relative'>
            {
                showinfo.length > 0 ?
                    <>
                        {lclstate}
                        <Moreinfo msg={lclstate ? showinfo[1] : showinfo[0]} child={

                            <input

                                className={` mt-[0.3rem] h-3.5 w-9 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none  after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] ${lclstate ? "bg-green-600 after:bg-green-600 after:border-white after:border-2 after:border-solid" : "bg-red-600 after:bg-red-600 after:border-white after:border-2 after:border-solid"}`}
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault02"
                                checked={lclstate}
                                onChange={(e) => {
                                    onChange(e)
                                    setlclstate(prev => !prev)
                                }}

                            />
                        } /> </> : <input

                        className={` mt-[0.3rem] h-3.5 w-9 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none  after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] ${lclstate ? "bg-green-600 after:bg-green-600 after:border-white after:border-2 after:border-solid" : "bg-red-600 after:bg-red-600 after:border-white after:border-2 after:border-solid"}`}
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault02"
                        defaultChecked={lclstate}
                        onChange={(e) => {
                            onChange(e)
                            setlclstate(prev => !prev)
                        }}

                    />
            }
        </div>


        // <button onClick={onClick} className={`${classes} flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primaryLine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton`}>

        // </button>
    )
}

export default ToggleButton