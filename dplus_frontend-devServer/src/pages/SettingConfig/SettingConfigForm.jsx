import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import CommonForm from '../../components/CommonForm';
import Button from '../../components/Button';
import AdminManagementActions from '../../store/actions/adminManagement-actions';
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
import AuthActions from '../../store/actions/auth-actions';
const SettingConfigForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)

    const [loadOpen, setloadOpen] = useState(true)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    let dispatch = useDispatch()
    let roleList = useSelector((state) => {
        console.log(state, "state state")
        return state?.adminManagement?.roleList
    })
    // let commonConfig = useSelector((state) => {
    //     if(state?.auth?.commonConfig && loadOpen){
    //         setloadOpen(false)
    //         setValue("mapScale",state?.auth?.commonConfig?.mapScale)
    //         setValue("mapView",state?.auth?.commonConfig?.mapView)
            
    //     }
    //     console.log(state?.auth?.commonConfig, "state state")
    //     return state?.auth?.commonConfig
    // })

    let commonConfig = useSelector((state) => state?.auth?.commonConfig)

    useEffect(() => {
        if (commonConfig && loadOpen) {
            setloadOpen(false)

            setValue("mapScale", commonConfig?.mapScale)
            setValue("mapView", commonConfig?.mapView)
        }
    }, [commonConfig])

    let databaseList = useSelector((state) => {
        console.log(state, "state")
        let interdata = state?.customQuery?.databaseList

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.databaseList
    })
    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]
    let Form = [
        {
            label: "Map Scale",
            value: "10",
            name: "mapScale",
            type: "range",
            required: false,
            props: {
                onChange: ((e) => {
                    console.log(e.target.value, "e geeter")

                    setValue("mapScale", e.target.value)

                }),
            },
            classes: "col-span-1"
        },
        {
            label: "Map View",
            value: "mapbox://styles/mapbox/standard",
            name: "mapView",
            type: "select",
            required: false,
            props: {},
            option: [
                {
                    label: "Standard",
                    value: "mapbox://styles/mapbox/standard",
                },
                {
                    label: "Streets",
                    value: "mapbox://styles/mapbox/streets-v11",
                },
                {
                    label: "Outdoors",
                    value: "mapbox://styles/mapbox/outdoors-v11",
                },
                {
                    label: "Light",
                    value: "mapbox://styles/mapbox/light-v10",
                },
                {
                    label: "Dark",
                    value: "mapbox://styles/mapbox/dark-v10",
                },
                {
                    label: "Light",
                    value: "mapbox://styles/mapbox/light-v10",
                },
                {
                    label: "Satellite",
                    value: "mapbox://styles/mapbox/satellite-v9",
                },
                {
                    label: "Satellite Streets",
                    value: "mapbox://styles/mapbox/satellite-streets-v11",
                },
                {
                    label: "Navigation Day",
                    value: "mapbox://styles/mapbox/navigation-day-v1",
                },
                {
                    label: "Navigation Night",
                    value: "mapbox://styles/mapbox/navigation-night-v1",
                }
            ],
            classes: "col-span-1"
        },


        // {
        //     label: "Map Scaling",
        //     value: "",
        //     name: "mapScaling",
        //     type: "rangeBar",
        //     required: false,
        //     props: {
        //         onChange: ((e) => {
        //             console.log(e.target.value, "e geeter")

        //             // setValue("mapScale",e.target.value)

        //         }),
        //     },
        //     classes: "col-span-1"
        // },
        // { label: "User", value: "", option: ["User Name"], type: "select" }
    ]

    const onSubmit = (data) => {
        console.log(data)
        // dispatch(AuthActions.signIn(data, () => {
        //     navigate('/authenticate')
        // }))

    }


    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")




        // dasdsadsadasdas
        dispatch(AuthActions.setupConf(true, data, () => {
            console.log("CustomQueryActions.postDBConfig")
        }))


    }





    console.log(Form, "Form 11")



    useEffect(() => {
        // dispatch(nokiaPrePostActions.getnokiaprepost())

        if (resetting) {
            reset({})
            Form.map((fieldName) => {
                setValue(fieldName["name"], fieldName["value"]);
            });
        } else {
            reset({})

            console.log(Object.keys(formValue), "Object.keys(formValue)")
            Object.keys(formValue).forEach((key) => {
                if (["endAt", "startAt"].indexOf(key) != -1) {
                    console.log("date formValuekey", key, formValue[key])
                    const momentObj = moment(formValue[key]);
                    setValue(key, momentObj.toDate());


                } else {
                    // console.log("formValuekey",key,key)
                    setValue(key, formValue[key]);
                }
            })
        }
    }, [])
    return <>


        <Modal size={"sm"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        <div className="mt-10 p-4">

            <div className='bg-primaryLine flex mx-auto w-full h-10 justify-center items-center'>
                <h1 className='text-white'>MAP Configuration</h1>
            </div>
            <div className='border-2 border-primaryLine p-4'>
                <CommonForm classes={"grid-cols-2 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            </div>

            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-6 w-24"} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default SettingConfigForm;
