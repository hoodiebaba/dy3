import React, { useState } from 'react';
import Modalmoreinfo from './Modalmoreinfo';
import Modal from './Modal';

const TableJson = ({ headers, columns }) => {

    const [openModal, setOpenModal] = useState(false)
    const [modalBody, setModalBody] = useState("")

    return <>
        <table border={1} className='h-auto table-auto'>
            <thead className='bg-primaryLine text-white sticky -top-1 z-10'>
                <tr>
                    {
                        headers.map((itm) => {
                            return <th className='border-gray-400 border-2'>
                                {itm}
                            </th>
                        })
                    }
                </tr>
            </thead>
            <tbody className='overflow-scroll'>
                {
                    columns.map((itm) => {
                        return <tr>
                            {headers.map((innerItm) => {
                                return <td className='border-gray-200 border-2 whitespace-nowrap'>
                                    <Modalmoreinfo setModalBody={setModalBody} setOpenModal={setOpenModal} value={itm[innerItm]} />
                                </td>
                            })}
                        </tr>

                    })
                }
            </tbody>
        </table >

        <Modal children={modalBody} setIsOpen={setOpenModal} isOpen={openModal} size={"sm"} />
    </>
};

export default TableJson;
