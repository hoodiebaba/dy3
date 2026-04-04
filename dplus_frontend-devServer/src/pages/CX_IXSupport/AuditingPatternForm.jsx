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
const AuditingPatternForm = ({ isOpen, uid, setIsOpen, resetting, formValue = {} }) => {

    console.log(isOpen, setIsOpen, resetting, formValue, "formValueformValue")

    const [modalOpen, setmodalOpen] = useState(false)
    const [CName, setCName] = useState("Select")
    const [MName, setMName] = useState("Select")
    const [SRName, setSRName] = useState("Select")
    const [OSSName, setOSSName] = useState("Select")


    let completeData = useSelector((state) => {
        return state.cxix.cxix_scripting_form
    })


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


    // console.log(Object.entries(completeData), "completeDatacompleteDatacompleteData")
    // console.log(CName != "Select" ? completeData[CName] : [], "completeDatacompleteDatacompleteData")
    // console.log(MName != "Select" ? completeData[CName][MName] : [], "completeDatacompleteDatacompleteData")
    // console.log(SRName != "Select" ? completeData[CName][MName][SRName] : [], "completeDatacompleteDatacompleteData")
    let Form = [
        {
            label: "Audit Type",
            name: "audit_type",
            value: CName,
            type: "select",
            option: completeData ? completeData["audit_type"].map((itm) => {
                return { "label": itm, "value": itm }
            }) : [],

            props: {
                onChange: (e) => {
                    setCName(e.target.value)
                    console.log(e.target.value, "customerNamecustomerNamecustomerNamecustomerNamecustomerName")
                }
            },
            required: true,
            classes: "col-span-1"
        }, {
            label: "Market Name",
            name: "market",
            value: MName,
            type: "select",
            option: completeData ? completeData["market"].map((itm) => {
                return { "label": itm, "value": itm }
            }) : [],
            props: {
                onChange: (e) => {
                    setMName(e.target.value)
                    console.log(e.target.value, "customerNamecustomerNamecustomerNamecustomerNamecustomerName")
                }
            },
            required: true,
            classes: "col-span-1"
        }, {
            label: "Version",
            name: "version",
            value: SRName,
            type: "select",
            option: completeData ? completeData["versions"].map((itm) => {
                return { "label": itm, "value": itm }
            }) : [],
            props: {
                onChange: (e) => {
                    setSRName(e.target.value)
                    console.log(e.target.value, "customerNamecustomerNamecustomerNamecustomerNamecustomerName")
                }
            },
            required: true,
            classes: "col-span-1"
        }, 
        // {
        //     label: "ENM/OSS",
        //     name: "sw_enm",
        //     value: OSSName,
        //     type: "select",
        //     option: SRName != "Select" ? Object.entries(completeData[CName][MName][SRName]).map((itm) => {
        //         return { "label": itm[0], "value": itm[0] }
        //     }) : [],
        //     props: {
        //         onChange: (e) => {
        //             setOSSName(e.target.value)
        //             console.log(e.target.value, "customerNamecustomerNamecustomerNamecustomerNamecustomerName")
        //         }
        //     },
        //     required: true,
        //     classes: "col-span-1"
        // }, 
        {
            label: "Site Id",
            value: "",
            name: "sites",
            type: "text",
            required: true,
            props: {},
            classes: "col-span-1"
        },{
            label: "earfcndl for B66 if DLOnly",
            value: "",
            name: "dlonly",
            type: "text",
            required: true,
            props: {},
            classes: "col-span-1"
        }, {
            label: "UMTS Femto arfcnValueUtranDl",
            value: "",
            name: "femto",
            type: "text",
            required: false,
            props: {},
            classes: "col-span-1"
        }, {
            label: "DCGK Files",
            value: "",
            name: "DCGKFile",
            type: "file",
            required: false,
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

        dispatch(cxixActions.post_cxix_audit_form(true, uid, data, () => {
            setIsOpen(false)

            dispatch(cxixActions.get_cxix_audit_data_list(uid))
        }))


    }





    console.log(Form, "Form 11")



    useEffect(() => {

    }, [])
    return <>


        {/* <Modal size={"sm"} children={<><CommonForm classes={"grid-cols-1 gap-1"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} /></>} isOpen={modalOpen} setIsOpen={setmodalOpen} /> */}

        <div className="mt-10 w-full p-2">

            <CommonForm classes={"grid-cols-2 gap-4"} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} />
            {/* <button></button> */}


            {/* <button onClick={() => { setmodalOpen(true) }} className='flex bg-primaryLine mt-6 w-42 absolute right-1 top-1 justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Add DB Type <Unicons.UilPlus /></button> */}
            {/* <Table headers={["S.No.", "DB Type", "DB Server", "DB Name", "Created By", "Created Date", "Last Modified By", "Last Modified Date", "Actions"]} columns={[["1", "abcd", "ancd", "abcd", "ancd"], ["2", "adsa", "dasdas", "abcd", "ancd"]]} /> */}
            {/* <button onClick={(handleSubmit(onTableViewSubmit))} className='bg-primaryLine mt-6 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button> */}
            <Button classes={"mt-2 "} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
        </div>
    </>


};

export default AuditingPatternForm;
