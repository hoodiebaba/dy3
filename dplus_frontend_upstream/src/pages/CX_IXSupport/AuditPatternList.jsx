import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Unicons from '@iconscout/react-unicons';
import { UilFileDownload } from '@iconscout/react-unicons'
import { useDispatch, useSelector } from 'react-redux';
import DBUpdateForm from './DBUpdateForm';
import AdvancedTable from '../../components/AdvancedTable';
import Button from '../../components/Button';
import AdminManagementActions from '../../store/actions/adminManagement-actions';
import CstmButton from '../../components/CstmButton';
import DeleteButton from '../../components/DeleteButton';
import ToggleButton from '../../components/ToggleButton';
import EditButton from '../../components/EditButton';
import cxixActions from '../../store/actions/cxix-actions';
import Modal from '../../components/Modal';
import { baseassetUrl } from '../../utils/url';
import { useNavigate, useParams } from 'react-router-dom';
import CommonActions from '../../store/actions/common-actions';
import ScriptingPatternForm from './ScriptingPatternForm';
import AdvancedTableExpandable from '../../components/AdvancedTableExpandable';
import AuditingPatternForm from './AuditingPatternForm';



const AuditPatternList = () => {


    const { uid } = useParams()
    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)



    let dispatch = useDispatch()
    let navigate = useNavigate()


    let statusColor = {
        "Completed": "bg-green-600 p-1 rounded-xl w-24 text-center text-white",
        "Running": "bg-yellow-600 p-1 rounded-xl w-24 text-center text-white",
        "Failed": "bg-red-600 p-1 rounded-xl w-24  text-center text-white"
    }



    let roleList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.adminManagement?.roleList
        return interdata
    })
    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.cxix?.cxix_scripting_data_list

        return interdata.map((itm) => {
            let updateditm = {
                ...itm.fields,
                "logFile": <div className='flex justify-center'> <CstmButton classes='w-10' child={<Button icon={<UilFileDownload width={18}/>} onClick={() => {

                    console.log(baseassetUrl + itm.fields.script, "baseassetUrl+itm.fields.script")
                    dispatch(CommonActions.commondownload(baseassetUrl + itm.fields.script, "log_file.zip"))
                }}></Button>} /></div>,
                "stat": <div className='flex justify-center p-2 '><p className={statusColor[itm?.fields?.status]}>{itm?.fields?.status}</p></div>
            }
            return updateditm
        });
    })



    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.adminManagement?.usersList

        if (interdata.length > 0) {
            return interdata[0]["overall_table_count"]
        } else {
            return 0
        }
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
                name: "Sites",
                value: "sites",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "Market Name",
                value: "market",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "Version",
                value: "version",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "Audit Type",
                value: "audit_type",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "dlonly",
                value: "dlonly",
                style: "min-w-[100px] max-w-[100px]"
            },
            {
                name: "femto",
                value: "femto",
                style: "min-w-[100px] max-w-[100px]"
            },
            
            {
                name: "Download Output",
                value: "logFile",
                style: "min-w-[140px] max-w-[140px]"
            },
            {
                name: "Status",
                value: "stat",
                style: "min-w-[100px] max-w-[100px]"
            },
            {
                name: "Create Date",
                value: "create_dt",
                style: "min-w-[200px] max-w-[200px]"
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            // {
            //     label: "Role",
            //     type: "select",
            //     name: "rolename",
            //     option: roleList,
            //     props: {

            //     }
            // }
        ]
    }


    const onSubmit = (data) => {
        let value = data.reseter
        delete data.reseter
        dispatch(AdminManagementActions.getUsersList(value, objectToQueryString(data)))
    }

    useEffect(() => {
        dispatch(cxixActions.get_cxix_audit_data_list(uid))
        dispatch(cxixActions.get_cxix_audit_form(uid))
    }, [])


    return <>

        <AdvancedTable

            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(AdminManagementActions.getUsersList())
                setmodalHead("Create New Script")
                setmodalBody(<AuditingPatternForm uid={uid} isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }}
                name={"Create New Script"}></Button></>}
            table={table}
            filterAfter={onSubmit}
            tableName={"UserListTable"}
            handleSubmit={handleSubmit}
            data={dbConfigList}
            errors={errors}
            register={register}
            setValue={setValue}
            getValues={getValues}
            totalCount={dbConfigTotalCount}
        />

        <Modal size={"sm"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default AuditPatternList;
