import React, { useState, useEffect } from 'react'
import * as Unicons from '@iconscout/react-unicons';

const CustomDropdown = ({ its, children }) => {

    const [showOpen, setShowOpen] = useState(false)
    return (
        <>
            <div className='border-2 border-black  p-2 m-2 '>
                <div onClick={() => {
                    setShowOpen(prev => !prev)
                }} className='flex  justify-between'>
                    <h1>{its}</h1>

                    {showOpen ? <Unicons.UilAngleUp /> : <Unicons.UilAngleDown />}
                </div>
                {
                    showOpen && <div className='    '>
                        {children}
                    </div>
                }
            </div>
        </>)
}



export default CustomDropdown;