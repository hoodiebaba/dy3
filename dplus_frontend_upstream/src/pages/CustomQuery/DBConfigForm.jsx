import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import Button from '../../components/Button';
const DBConfigForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)


    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })
    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]
    let Form = [
        { label: "DB Type", name: "dbtype", value: "name", type: "select", option: [{ "label": "MSSQL", "value": "MSSQL" }, { "label": "MySQL", "value": "MySQL" }, { "label": "PostgreSQL", "value": "PostgreSQL" }], props: "", required: true, },
        { label: "DB Server", name: "dbServer", value: "name", type: "text", props: "", required: true },
        { label: "DB Name", name: "dbName", value: "name", type: "text", props: "", required: true },
        { label: "Username", name: "username", value: "name", type: "text", props: "", required: true },
        { label: "Password", name: "password", value: "name", type: "password", props: "", required: true },
        { label: "Port", name: "port", value: "name", type: "text", props: "", required: true },
        {
            label: "Users",
            value: "",
            name: "userId",
            option: userList,
            type: "select",
            required: true,
            displayValue: "label",
            props: {
                // valueAsNumber: true,
                // onChange: ((e) => {
                //     setValue("userId",+e.target.value)
                // }),
            },
            classes: "col-span-1"
        },
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

    const onTableViewTest = (data) => {
        console.log(data, "datadata")
        dispatch(CustomQueryActions.testDBConfig(true, data, () => {
            
            }))
        }

    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")

        if (data.uniqueId) {
            delete data.name
            dispatch(CustomQueryActions.postDBConfig(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(CustomQueryActions.getDBConfig())
            }, data.uniqueId))
        } else {
            dispatch(CustomQueryActions.postDBConfig(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(CustomQueryActions.getDBConfig())
            }))
        }


    }





    console.log(Form, "Form 11")



    useEffect(() => {

        if (resetting) {
            reset({})
            Form.map((fieldName) => {
                setValue(fieldName["name"], "");
            });
        } else {
            reset({})
            Object.keys(formValue).forEach((key) => {
                setValue(key, formValue[key]);
            })
        }
    }, [formValue, resetting])
    return <>


        <Modal size={"xl"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            <CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <div className='flex'>
                <Button classes={"mt-2 mr-4"} onClick={(handleSubmit(onTableViewTest))} name="Test" />
                <Button classes={"mt-2 ml-4"} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
            </div>

            
        </div>
    </>


};

export default DBConfigForm;
