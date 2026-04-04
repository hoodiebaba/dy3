import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import moment from 'moment';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import Button from '../../components/Button';
import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';
const AlertConfigureForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)


    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })
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
        { label: "Frequency", name: "frequency", value: "Select", type: "select", option: [{ "label": "Hourly", "value": "Hourly" }, { "label": "Daily", "value": "Daily" }], props: "", required: true, },
        {
            label: "Select Server",
            value: "Select",
            name: "dbServer",
            option: databaseList,
            type: "select",
            required: true,
            props: {
                // valueAsNumber: true,
                onChange: ((e) => {
                    // console.log(e.target.name, "e geeter")

                }),
            },
            classes: "col-span-1"
        },
        // { label: "DB Server", name: "dbServer", value: "name", type: "text", props: "", required: true },
        // { label: "DB Name", name: "dbName", value: "name", type: "text", props: "", required: true },
        // { label: "Username", name: "username", value: "name", type: "text", props: "", required: true },
        // { label: "Password", name: "password", value: "name", type: "password", props: "", required: true },
        {
            label: "Mail Query",
            value: "",
            name: "mailQuery",
            type: "textarea",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Graph Query",
            value: "",
            name: "graphQuery",
            type: "textarea",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Mail Subject",
            value: "",
            name: "mailSubject",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-2"
        }, {
            label: "Mail Recipients",
            value: "",
            name: "mailRecipients",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-2"
        }, {
            label: "Mail Body",
            value: "",
            name: "mailBody",
            type: "textarea",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-2"
        },

        { label: "Start Date", name: "startAt", type: "datetime",formattype:"date",format:"yyyy-MM-dd",formatop:"yyyy-MM-DD",  required: true },
        { label: "End Date", name: "endAt", type: "datetime",formattype:"date",format:"yyyy-MM-dd", formatop:"yyyy-MM-DD",required: true},
        { label: "Time", name: "timeall", type: "datetime", formattype:"time",format:"HH:mm",formatop:"HH:mm",interval:15, required: true},
        {
            label: "Users",
            value: "Select",
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
        {
            label: "Mail Output",
            value: "Select",
            name: "mailOutput",
            option: [
                {
                    label:"Excel",
                    value:"excel"
                },
                {
                    label:"CSV",
                    value:"csv"
                }
            ],
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


    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")




        // dasdsadsadasdas
        if (data.id) {
            delete data.name
            dispatch(AlertConfigurationActions.pAlertConfig(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(AlertConfigurationActions.alertConfigurationList())
            }, data.id))
        } else {
            dispatch(AlertConfigurationActions.pAlertConfig(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(AlertConfigurationActions.alertConfigurationList())
            }))
        }


    }





    console.log(Form, "Form 11")



    useEffect(() => {
        dispatch(CustomQueryActions.getDatabaseList())

        if (resetting) {
            reset({})
            Form.map((fieldName) => {
                setValue(fieldName["name"], fieldName["value"]);
            });
        } else {
            reset({})

            console.log(Object.keys(formValue),"Object.keys(formValue)")
            Object.keys(formValue).forEach((key) => {
                if(["endAt","startAt"].indexOf(key)!=-1){
                    console.log("date formValuekey",key,formValue[key])
                    const momentObj = moment(formValue[key]);
                    setValue(key, momentObj.toDate());


                }else{
                    // console.log("formValuekey",key,key)
                    setValue(key, formValue[key]);
                }
            })
        }
    }, [formValue, resetting])
    return <>


        <Modal size={"xl"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        <div className="mt-4 p-2 m-auto max-w-lg sm:mx-auto sm:w-full sm:max-w-2xl">

            <CommonForm classes={"grid-cols-1 sm:grid-cols-2 gap-2"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-2 "} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default AlertConfigureForm;
