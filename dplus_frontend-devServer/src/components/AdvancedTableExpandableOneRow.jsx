import React, { useEffect, useState } from 'react';
import Button from './Button';
import PopupMenu from './PopupMenu';
import { UilAngleDown, UilAngleUp } from '@iconscout/react-unicons'
import { current } from '@reduxjs/toolkit';
import { UilColumns } from '@iconscout/react-unicons'
import { UilFilter } from '@iconscout/react-unicons'
import Modalmoreinfo from './Modalmoreinfo';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import { objectToArray } from '../utils/commonFunnction';
import moment from 'moment';

const AdvancedTableExpandableOneRow = ({ setOpenModal, setModalBody, table, itm, hide }) => {



    const [expand, setExpand] = useState(false)

    return <>
        <tr>

            <td className='text-[14px] pl-1 border-primaryLine border-2 text-primaryLine '>
                <span onClick={() => {
                    setExpand(prev => !prev)
                }}>{expand ? <UilAngleUp /> : <UilAngleDown />}
                </span>
            </td>
            {table.columns.map((innerItm, index) => {

                return hide.indexOf(String(index)) == -1 ? <td className={`text-[14px] pl-1 border-primaryLine border-2 text-primaryLine ${innerItm.style ? innerItm.style : " min-w-[300px] max-w-[500px]"}`}>

                    <Modalmoreinfo ctt={32} setModalBody={setModalBody} setOpenModal={setOpenModal} value={itm[innerItm.value]} />
                </td> : <></>
            })}
        </tr>

        



    </>

};

export default AdvancedTableExpandableOneRow;
