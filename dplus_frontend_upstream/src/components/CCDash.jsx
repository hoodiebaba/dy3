import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

const CCDash = ({ showbtn = false, label = "", settype, approveddata }) => {

    const navigate = useNavigate()

    return <>
        {
            showbtn && <div className='flex p-2'>
                <Button classes='w-auto' onClick={() => {
                    settype(true)
                }} name={label} />
            </div>
        }
        <div className='p-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 grid col-span-12 rounded-md gap-4' >
            {approveddata}
        </div>
    </>
}

export default CCDash