import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import moment from 'moment';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/Button';
import isonFormActions from '../../store/actions/isonForm-actions';
import { Urls } from '../../utils/url';
import CommonFormTwo from '../../components/CommonFormTwo';
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
// const iSONForm = ({ isOpen, setIsOpen, resetting, formValue = {} }) => {
const ISONForm = () => {


    // console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()
    const [modalOpen, setmodalOpen] = useState(false)
    const [firstLoad, setfirstLoad] = useState(true)

    const [Form, setupForm] = useState([])
    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })

    let isonForm = useSelector((state) => {
        if (Form.length==0 && state?.isonForm?.getisonForm.length > 0) {
            let newData = state?.isonForm?.getisonForm
            console.log(newData, "newDatanewData")
            let mergedData = [{
                label: "Input File",
                value: "",
                name: "uploadedFile",
                type: "file",
                required: false,
                props: {},
                classes: "col-span-1 sm:col-span-1 flex justify-between"
            },{
                label: "a",
                value: "a",
                name: "a",
                type: "hidden",
                required: false,
                props: {},
                classes: "col-span-1 sm:col-span-1 flex justify-between"
            }]
            newData.map((itm) => {
                console.log(itm, "itmitmitmitm")
                if (itm.type == "select") {
                    mergedData.push({
                        label: itm.label,
                        value: itm.defaultValue,
                        name: itm.name,
                        type: itm.type,
                        option: itm.value,
                        required: true,
                        props: {},
                        classes: "col-span-1 flex justify-between"
                    })
                    setValue(itm.name, itm.defaultValue)
                }
                if (itm.type == "checkbox") {
                    mergedData.push({
                        label: itm.label,
                        value: itm.defaultValue,
                        name: itm.name,
                        type: itm.type,
                        option: itm.value,
                        required: true,
                        props: {},
                        classes: "col-span-1 flex justify-between"
                    })
                    setValue(itm.name, itm.defaultValue)
                }
                if (itm.type == "number") {
                    mergedData.push({
                        label: itm.label,
                        value: itm.defaultValue,
                        name: itm.name,
                        type: itm.type,
                        required: true,
                        props: {},
                        classes: "col-span-1 flex justify-between"
                    })

                    setValue(itm.name, itm.defaultValue)
                }
            })



            setupForm(mergedData)
            setfirstLoad(false)
            console.log(mergedData, "mergedDatamergedDatamergedData")

        }

        return state?.isonForm?.getisonForm
    })

    let databaseList = useSelector((state) => {
        console.log(state, "state")
        let interdata = state?.customQuery?.databaseList

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.databaseList
    })
    // let Form = [

    // ]



    const onSubmit = (data) => {
        console.log(data)
        // dispatch(AuthActions.signIn(data, () => {
        //     navigate('/authenticate')
        // }))

    }


    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")




        // dasdsadsadasdas
        dispatch(nokiaPrePostActions.postFileSubmit(Urls.isonForm, data, () => {
            setupForm([])
        }))



    }





    console.log(Form, "Form 11")
    useEffect(() => {
        dispatch(isonFormActions.getIsonFormList())
        console.log("useEffect")
    }, [])


    // useEffect(() => {
    //     dispatch(CustomQueryActions.getDatabaseList())

    //     if (resetting) {
    //         reset({})
    //         Form.map((fieldName) => {
    //             setValue(fieldName["name"], fieldName["value"]);
    //         });
    //     } else {
    //         reset({})

    //         console.log(Object.keys(formValue), "Object.keys(formValue)")
    //         Object.keys(formValue).forEach((key) => {
    //             if (["date"].indexOf(key) != -1) {
    //                 console.log("date formValuekey", key, formValue[key])
    //                 const momentObj = moment(formValue[key]);
    //                 setValue(key, momentObj.toDate());


    //             } else {
    //                 // console.log("formValuekey",key,key)
    //                 setValue(key, formValue[key]);
    //             }
    //         })
    //     }
    // }, [formValue, resetting])
    return <>


        {/* <Modal size={"xl"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} /> */}

        <div className="mt-4 bg-gray-50 border border-gray-700 rounded-2xl p-2 max-w-2xl sm:mx-auto sm:w-auto sm:max-w-full">

            <CommonFormTwo encType={true} classes={"grid-cols-1 sm:grid-cols-2 gap-2 gap-x-16"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-2 w-[100px] mx-auto"} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default ISONForm;
