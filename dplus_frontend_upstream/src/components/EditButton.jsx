import React from 'react'
import { UilEdit } from '@iconscout/react-unicons'
import Button from './Button'
const EditButton = ({ onClick }) => {

    return (
        <div className='flex justify-around'><Button name={""} classes={"w-12"} icon={<UilEdit size="18" className={"hello"} />} onClick={onClick} /></div>
    )
}

export default EditButton