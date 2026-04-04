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
import { reset } from 'ol/transform';;
import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';
import ToggleButton from '../../components/ToggleButton';
import CstmButton from '../../components/CstmButton';
import MtandaoComplaintsForm from './MtandaoComplaintsForm';
import MtandaoComplaintsActions from '../../store/actions/mtandaoComplaints-actions';
import { objectToQueryString } from '../../utils/commonFunnction';
const ViewMtandaoComplaints = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)



    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })

    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.mtandaoComplaints?.mtandaoComplaintsList

        if(interdata.length>0){
            return interdata[0]["overall_table_count"]
        }else{
            return 0
        }
    })

    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.mtandaoComplaints?.mtandaoComplaintsList

        return interdata.map((itm) => {
            let updateditm = {
                ...itm,
                "status": <CstmButton child={<ToggleButton showinfo={['Open', 'Closed']} onChange={(e) => {

                    console.log(e.target.checked, "e.target.checked")

                    let data = {
                        "status": e.target.checked ? "Closed" : "Open"
                    }
                    dispatch(MtandaoComplaintsActions.patchmtandaoComplaint(true, data, () => {
                        e.target.checked = e.target.checked
                        // itm.status=e.target.checked
                    }, itm.id))

                }} defaultChecked={itm.status == "Closed" ? true : false}></ToggleButton>} />,
                "update": <CstmButton child={<Button name={"Update"} onClick={() => {

                    console.log(itm, "itm,dsadsadadada")
                    setmodalOpen(true)
                    dispatch(CustomQueryActions.getUserList())
                    setmodalHead("Update Network Complaints")
                    setmodalBody(<>
                        <MtandaoComplaintsForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
                        {/* <div className='mx-3'><Button name={"Submit"} classes={""} onClick={(handleSubmit(onTableViewSubmit))} /></div> */}
                    </>)
                }}></Button>} />,

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
                name: "Date",
                value: "date",
                style: "min-w-[250px] max-w-[200px]"
            },
            {
                name: "Subscriber No",
                value: "subscriberNo",
                style: "min-w-[200px] max-w-[250px]"
            },
            {
                name: "Incident No",
                value: "incidentNo",
                style: "min-w-[200px] max-w-[250px]"
            },
            {
                name: "Remarks",
                value: "remarks",
            },
            {
                name: "Status",
                value: "status",
                style: "min-w-[100px] max-w-[200px]"
            },
            {
                name: "Update",
                value: "update",
                style: "min-w-[100px] max-w-[200px]"
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            {
                label: "Subscriber No",
                type: "text",
                name:"subscriberNo",
                props: {

                }
            }, {
                label: "Incident No",
                type: "text",
                name: "incidentNo",
                props: {

                }
            }, {
                label: "Date",
                type: "datetime",
                name: "dateTime",
                props: {

                }
            }, {
                label: "Status",
                type: "select",
                name: "status",
                option: [
                    {
                        label: "Open",
                        valuee: "Open"
                    },
                    {
                        label: "Closed",
                        valuee: "Closed"
                    }
                ],
                props: {

                }
            }
        ]
    }

    const onSubmit = (data) => {
        let value=data.reseter
        delete data.reseter
        dispatch(MtandaoComplaintsActions.getmtandaoComplaintsList(value,objectToQueryString(data)))
    }
    
    useEffect(() => {
        dispatch(MtandaoComplaintsActions.getmtandaoComplaintsList())
    }, [])


    return <>
        <AdvancedTable  
            filterAfter={onSubmit}
            tableName={"ViewNetworkComplaints"}
        
            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(CustomQueryActions.getUserList())
                setmodalHead("New Scheduler")
                setmodalBody(<MtandaoComplaintsForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }} name={"Add New"}></Button></>} 
        
            table={table} 
            handleSubmit={handleSubmit} 
            data={dbConfigList} 
            errors={errors} 
            register={register} 
            setValue={setValue} 
            getValues={getValues} 
            totalCount={dbConfigTotalCount} 
        />

        <Modal 
            size={"xl"} 
            modalHead={modalHead} 
            children={modalBody} 
            isOpen={modalOpen} 
            setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default ViewMtandaoComplaints;
