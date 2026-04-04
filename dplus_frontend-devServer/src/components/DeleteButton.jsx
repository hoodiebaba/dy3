import React from 'react'
import { UilTrashAlt } from '@iconscout/react-unicons'
import Button from './Button'


const DeleteButton = ({ onClick }) => {

    return (
        <Button
        name=""
        classes="w-10 h-8 bg-red-600 p-0 flex items-center justify-center"
        icon={<UilTrashAlt size={18} />}
        onClick={onClick}
        />
    )
}

/* const DeleteButton = ({ onClick }) => { 
    return ( 
    <div className='flex justify-around'>
        <Button 
        name={""} 
        classes={"w-12 bg-red-600"} 
        icon={<UilTrashAlt size="18" className={"hello"} />} 
        onClick={onClick} />
    </div> 
    ) 
} */

export default DeleteButton