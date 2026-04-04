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
const NokiaToolManagementQueryForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)


    let dispatch = useDispatch()
    let roleList = useSelector((state) => {
        console.log(state, "state state")
        return state?.adminManagement?.roleList
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
        {
            label: "Code",
            value: "",
            name: "Code",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "KPI Name",
            value: "",
            name: "KPI_Name",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Technology",
            value: "",
            name: "Technology",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Agrregation",
            value: "",
            name: "Agrregation",
            type: "text",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Type",
            name: "Type",
            value: "",
            type: "text",
            props: "",
            required: true,
            classes: "col-span-1"
        }, {
            label: "Query",
            value: "",
            name: "Query",
            type: "textarea",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
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
        if (data.id) {
            dispatch(nokiaPrePostActions.postData(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(nokiaPrePostActions.getnokiaprepost())
            }, data.id))
        } else {
            dispatch(nokiaPrePostActions.postData(true, data, () => {
                console.log("CustomQueryActions.postDBConfig")
                setIsOpen(false)
                dispatch(nokiaPrePostActions.getnokiaprepost())
            }))
        }


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
    }, [formValue, resetting])
    return <>


        <Modal size={"sm"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

            <CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-6 "} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default NokiaToolManagementQueryForm;
