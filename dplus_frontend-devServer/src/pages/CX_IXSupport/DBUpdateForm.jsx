import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import AdminManagementActions from '../../store/actions/adminManagement-actions';
import CommonForm from '../../components/CommonForm';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import cxixActions from '../../store/actions/cxix-actions';
const DBUpdateForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)


    let dispatch = useDispatch()
    let roleList = useSelector((state) => {
        // console.log(state, "state state")
        return state?.adminManagement?.roleList
    })
    let databaseList = useSelector((state) => {
        // console.log(state, "state")
        let interdata = state?.customQuery?.databaseList

        // console.log(interdata, "interdatainterdata")
        return state?.customQuery?.databaseList
    })
    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]
    let Form = [
        {
            label: "APP Name",
            name: "appname",
            value: "Select",
            type: "select",
            option: [
                { "label": "T Mobile", "value": "tmobile" },
                { "label": "ATT Scripter", "value": "attscripter" },
                // { "label": "Two Way Auth", "value": "vz" },
                { "label": "ATT GS Audit", "value": "attgsaudit" }
            ],
            props: "",
            required: true,
            classes: "col-span-1"
        }, {
            label: "Input File",
            value: "",
            name: "uploadedFile",
            type: "file",
            required: false,
            props: {},
            classes: "col-span-1"
        }, {
            label: "Remark",
            value: "",
            name: "remark",
            type: "textarea",
            required: true,
            props: {},
            classes: "col-span-1"
        }
        // { label: "User", value: "", option: ["User Name"], type: "select" }
    ]

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        console.log(data)
        // dispatch(AuthActions.signIn(data, () => {
        //     navigate('/authenticate')
        // }))

    }

    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")



        // dasdsadsadasdas

        dispatch(cxixActions.post_dbUpdateList(true, data, () => {
            setIsOpen(false)
            dispatch(cxixActions.get_dbUpdateList())
        }))


    }





    console.log(Form, "Form 11")



    useEffect(() => {

    }, [])
    return <>


        {/* <Modal size={"sm"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} /> */}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            <CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-2 "} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default DBUpdateForm;
