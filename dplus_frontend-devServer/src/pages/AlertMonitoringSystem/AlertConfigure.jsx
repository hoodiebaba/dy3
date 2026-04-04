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
import DBConfigForm from './AlertConfigureForm';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import { ALERTS } from '../../store/reducers/component-reducer';
import CommonActions from '../../store/actions/common-actions';
import { Urls } from '../../utils/url';
import { reset } from 'ol/transform';
import AlertConfigureForm from './AlertConfigureForm';
import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';
import ToggleButton from '../../components/ToggleButton';
import CstmButton from '../../components/CstmButton';
import { objectToQueryString } from '../../utils/commonFunnction';
const AlertConfigure = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)



    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        // console.log(state, "state state")
        return state?.customQuery?.usersList
    })

    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.alertConfiguration?.configureAlertList
    
        if(interdata.length>0){
            return interdata[0]["overall_table_count"]
        }else{
            return 0
        }
    })
    let dbConfigList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.alertConfiguration?.configureAlertList

        return interdata.map((itm) => {
            let updateditm = {
                ...itm,
                "status": <CstmButton child={<ToggleButton onChange={(e) => {

                    console.log(e.target.checked, "e.target.checked")

                    let data = {
                        "enabled": e.target.checked ? 1 : 0
                    }
                    dispatch(AlertConfigurationActions.patchAlertConfig(true, data, () => {
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

                "edit": <CstmButton child={<EditButton name={""} onClick={() => {

                    console.log(itm, "itm,dsadsadadada")
                    setmodalOpen(true)
                    dispatch(CustomQueryActions.getUserList())
                    setmodalHead("Edit Scheduler")
                    setmodalBody(<>
                        <AlertConfigureForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
                        {/* <div className='mx-3'><Button name={"Submit"} classes={""} onClick={(handleSubmit(onTableViewSubmit))} /></div> */}
                    </>)
                }}></EditButton>}/>,


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
                }}></DeleteButton>}/>
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
                name: "Frequency",
                value: "frequency",
                style: "min-w-[100px] max-w-[200px]"
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
                name: "Mail Query",
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
                name: "Status",
                value: "status",
                style: "min-w-[100px] max-w-[200px]"
            },
            {
                name: "Start At",
                value: "startAt",
            },
            {
                name: "End At",
                value: "endAt",
            },
            {
                name: "Time",
                value: "timeall",
                style: "min-w-[100px] max-w-[200px]"
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
                    { "label": "Hourly", "value": "Hourly" }, 
                    { "label": "Daily", "value": "Daily" }
                ],
                props: {
        
                }
            }
        ]
    }


    const onSubmit = (data) => {
        let value = data.reseter
        delete data.reseter
        dispatch(AlertConfigurationActions.alertConfigurationList(value, objectToQueryString(data)))
    }




    useEffect(() => {
        dispatch(AlertConfigurationActions.alertConfigurationList())
    }, [])


    return <>

        <AdvancedTable 
            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(CustomQueryActions.getUserList())
                setmodalHead("New Scheduler")
                setmodalBody(<AlertConfigureForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }} name={"Add New"}></Button></>} 
            table={table} 

            filterAfter={onSubmit}
            tableName={"AlertConfigureList"}

            data={dbConfigList} 
            errors={errors} 
            handleSubmit={handleSubmit}
            register={register} 
            setValue={setValue} 
            getValues={getValues} 
            totalCount={dbConfigTotalCount}
            
        />

        <Modal size={"xl"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default AlertConfigure;
