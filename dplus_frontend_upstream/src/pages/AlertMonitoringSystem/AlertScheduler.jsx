import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import Button from '../../components/Button';
import AdvancedTable from '../../components/AdvancedTable';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import { ALERTS } from '../../store/reducers/component-reducer';
import CommonActions from '../../store/actions/common-actions';
import { Urls } from '../../utils/url';
import { reset } from 'ol/transform';
import AlertSchedulerForm from './AlertSchedulerForm';
import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';
import ToggleButton from '../../components/ToggleButton';
import CstmButton from '../../components/CstmButton';
import { objectToQueryString } from '../../utils/commonFunnction';
const AlertScheduler = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)



    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })


    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.alertConfiguration?.schedulerAlertList

        if (interdata.length > 0) {
            return interdata[0]["overall_table_count"]
        } else {
            return 0
        }
    })
    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.alertConfiguration?.schedulerAlertList

        return interdata.map((itm) => {
            let updateditm = {
                ...itm,
                "status": <CstmButton child={<ToggleButton onChange={(e) => {

                    console.log(e.target.checked, "e.target.checked")

                    let data = {
                        "enabled": e.target.checked ? 1 : 0
                    }
                    dispatch(AlertConfigurationActions.patchAlertScheduler(true, data, () => {
                        // alert(e.target.checked)
                        e.target.checked = e.target.checked
                    }, itm.id))

                    // if(itm.enabled==0){
                    //     itm.enabled=1
                    // }else{
                    //     itm.enabled=0
                    // }
                    // itm.enabled=itm.enabled==0?1:0

                    console.log(itm.enabled, "itm.enabled")




                }} defaultChecked={itm.enabled == 1 ? true : false}></ToggleButton>} />,

                // "statusBlock": <CstmButton child={<ToggleButton onChange={(e) => {

                //     console.log(e.target.checked, "e.target.checked")

                //     let data = {
                //         "blockage": e.target.checked ? 1 : 0
                //     }
                //     dispatch(AlertConfigurationActions.patchAlertScheduler(true, data, () => {
                //         // alert(e.target.checked)
                //         e.target.checked = e.target.checked
                //     }, itm.id))

                //     // if(itm.enabled==0){
                //     //     itm.enabled=1
                //     // }else{
                //     //     itm.enabled=0
                //     // }
                //     // itm.enabled=itm.enabled==0?1:0

                //     console.log(itm.enabled, "itm.enabled")




                // }} defaultChecked={itm.blockage == 1 ? true : false}></ToggleButton>} />,



                "statusBlock": <p className={`${itm.blockage == 1 ? "text-red-900" : "text-green-900"}`} onClick={(e) => {

                    let internalText=""
                    let internalclass=""
                    console.log(e.target.className, "statusBlock")
                    let data = {
                        "blockage": e.target.checked ? 1 : 0
                    }
                    if (e.target.innerText == "Blocked") {
                        internalText = "Unblocked"
                        internalclass="text-green-900"
                        data = {
                            "blockage": 0
                        }
                    }

                    if (e.target.innerText == "Unblocked") {
                        internalText = "Blocked"
                        internalclass="text-red-900"
                        data = {
                            "blockage": 1
                        }
                    }
                    
                    dispatch(AlertConfigurationActions.patchAlertScheduler(true, data, () => {
                        e.target.innerText=internalText
                        e.target.className = internalclass
                    }, itm.id))

                    // if(itm.enabled==0){
                    //     itm.enabled=1
                    // }else{
                    //     itm.enabled=0
                    // }
                    // itm.enabled=itm.enabled==0?1:0

                    console.log(itm.enabled, "itm.enabled")




                }}>{itm.blockage == 1 ? "Blocked" : "Unblocked"}</p>,

                "edit": <CstmButton child={<EditButton name={""} onClick={() => {

                    console.log(itm, "itm_____")
                    setmodalOpen(true)
                    dispatch(CustomQueryActions.getUserList())
                    setmodalHead("Edit Scheduler")
                
                    setmodalBody(<>
                        <AlertSchedulerForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
                        {/* <div className='mx-3'><Button name={"Submit"} classes={""} onClick={(handleSubmit(onTableViewSubmit))} /></div> */}
                    </>)
                }}></EditButton>} />,


                "delete": <CstmButton child={<DeleteButton name={""} onClick={() => {
                    let msgdata = {
                        show: true,
                        icon: 'warning',
                        buttons: [
                            <Button classes='w-15 bg-green-500' onClick={() => {
                                dispatch(CommonActions.deleteApiCaller(`${Urls.alertConfiguration_configureAlert}/${itm.uniqueId}`, () => {
                                    dispatch(CustomQueryActions.getDBConfig())
                                    dispatch(ALERTS({ show: false }))
                                }))
                            }} name={"OK"} />,
                            <Button classes='w-24' onClick={() => {
                                dispatch(ALERTS({ show: false }))
                            }} name={"Cancel"} />
                        ],
                        text: "Are you sure you want to Delete?"
                    }
                    dispatch(ALERTS(msgdata))
                }}></DeleteButton>} />
            }
            return updateditm
        });
    })
    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setValues,
        getValues,
        formState: { errors },
    } = useForm()

    let table = {
        columns: [
            {
                name: "Frequency(in mins)",
                value: "frequency",
                style: "min-w-[180px] max-w-[180px]"
            },
            {
                name: "DB Name",
                value: "dbName",
            },
            {
                name: "Graph Query",
                value: "graphQuery",
            },
            {
                name: "Mail Attachment Query",
                value: "mailQuery",
            },
            {
                name: "Mail Recipients",
                value: "mailRecipients",
            },
            {
                name: "Mail Subject",
                value: "mailSubject",
            },
            {
                name: "Mail Body",
                value: "mailBody",
            },
            {
                name: "Mail Query Body",
                value: "mailQueryBody",
            },
            {
                name: "Status",
                value: "status",
                style: "min-w-[100px] max-w-[200px]"
            },
            {
                name: "Block Status",
                value: "statusBlock",
                style: "min-w-[100px] max-w-[200px]"
            },

            {
                name: "Start At",
                value: "startAt",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "End At",
                value: "endAt",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Last Check At",
                value: "lastSendAt",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Next Check At",
                value: "nextSendAt",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Edit",
                value: "edit",
                style: "min-w-[100px] max-w-[200px]"
            },
            {
                name: "Delete",
                value: "delete",
                style: "min-w-[100px] max-w-[200px]"
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            {
                label: "Frequency",
                type: "select",
                name: "frequency",
                option: [
                    { label: 5, value: 5 },
                    { label: 10, value: 10 },
                    { label: 15, value: 15 },
                    { label: 20, value: 20 },
                    { label: 25, value: 25 },
                    { label: 30, value: 30 },
                    { label: 35, value: 35 },
                    { label: 40, value: 40 },
                    { label: 45, value: 45 },
                    { label: 50, value: 50 },
                    { label: 55, value: 55 },
                    { label: 60, value: 60 }
                ],
                props: {

                }
            }
        ]
    }

    const onSubmit = (data) => {
        let value = data.reseter
        delete data.reseter
        dispatch(AlertConfigurationActions.alertSchedulerList(value, objectToQueryString(data)))
    }

    useEffect(() => {
        dispatch(AlertConfigurationActions.alertSchedulerList())
    }, [])


    return <>
        <AdvancedTable
            filterAfter={onSubmit}
            tableName={"AlertSchedulerList"}
            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(CustomQueryActions.getUserList())
                setmodalHead("New Scheduler")
                setmodalBody(<AlertSchedulerForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }} name={"Add New"}></Button></>}
            table={table}
            data={dbConfigList}
            handleSubmit={handleSubmit}
            errors={errors}
            register={register}
            setValue={setValue}
            getValues={getValues}
            totalCount={dbConfigTotalCount} />

        <Modal size={"xl"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default AlertScheduler;
