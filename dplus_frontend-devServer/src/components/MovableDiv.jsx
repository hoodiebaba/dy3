import React, { useState,useEffect } from 'react'
import Button from './Button'
import { UilFilter } from '@iconscout/react-unicons'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ComponentActions from '../store/actions/component-actions'
import Draggable from 'react-draggable'
import { useForm } from 'react-hook-form';
import CommonForm from './CommonForm'
import MapActions from '../store/actions/map-actions'

const MovableDiv = ({ dataclasses = "", classes = "", popupname = "", name, child, icon }) => {
    // const [filterVisiblity, setfilterVisiblity] = useState(false)
    let filterVisiblity = useSelector((state) => {
        return state.component.popmenu
    })

    const location = useLocation()
    const dispatch = useDispatch()

    console.log(location.pathname, filterVisiblity, 'navigate')

    let techWithBandList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.map?.tech_with_band
        console.log(interdata, "tec")
        return interdata
    })
    
        useEffect(() => {
            // console.log('Sidebar Open state changed:', sidebarOpen);
            dispatch(MapActions.getTechWithBand())

    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

// console.log(techWithBandList,'dataatat')
// console.log(techWithBandList['2G'], '2G options');
    const multiSelectForm = [
      
        {
            label: "Select Technology",
            value: "",
            singleSelect: false,
            option: techWithBandList,
            name: "condition",
            type: "muitiSelect",
            onChanging: ((e) => {

            }),
            props: {
                onSelect: (e, a, b, c) => { console.log({ e, a, b, c }) }
            },
            classes: "text-center col-span-1 ml-14 w-64 h-24 p-4 border border-gray-400 rounded-md shadow-md hover:shadow-lg bg-blue-600",
        }
        // {
        //     label: "Select 3G",
        //     value: "",
        //     singleSelect: false,
        //     option: techWithBandList?.['3G'],
        //     name: "condition",
        //     type: "muitiSelect",
        //     onChanging: ((e) => {

        //     }),
        //     props: {
        //         onSelect: (e, a, b, c) => { console.log({ e, a, b, c }) }
        //     },
        //     classes: "col-span-1 ml-8 "
        // }
    ];

    return <>

        <Draggable>
        <div className='flex absolute flex-row z-[1000] align-center '>
                <CommonForm classes={"grid-rows-4 gap-1"} errors={errors} Form={multiSelectForm} register={register} setValue={setValue} getValues={getValues} />
            </div>
            {/* <div className='z-[1000] absolute'>I can now be moved around!</div> */}
        </Draggable>
    </>
}
export default MovableDiv
