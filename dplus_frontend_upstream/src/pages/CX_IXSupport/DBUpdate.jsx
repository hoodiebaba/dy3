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
import { useNavigate } from 'react-router-dom';
import CommonActions from '../../store/actions/common-actions';



const DBUpdate = () => {


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
        // console.log(state, "state state")
        let interdata = state?.cxix?.dbUpdateList

        return interdata.map((itm) => {
            let updateditm = {
                ...itm.fields,
                "logFile": <div className='flex justify-center'> <CstmButton classes='w-10' child={<Button icon={<UilFileDownload width={18}/>} onClick={() => {

                    console.log(baseassetUrl + itm.fields.script, "baseassetUrl+itm.fields.script")
                    dispatch(CommonActions.commondownload(baseassetUrl + itm.fields.script, "log_file.log"))
                }}></Button>} /></div>,
                "status": <div className='flex justify-center p-2 '><p className={statusColor[itm.fields.status]}>{itm.fields.status}</p></div>
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
                name: "App Name",
                value: "appname",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "Remark",
                value: "remark",
                style: "min-w-[240px] max-w-[240px]"
            },
            {
                name: "Status",
                value: "status",
                style: "min-w-[100px] max-w-[100px]"
            },
            {
                name: "Log File",
                value: "logFile",
                style: "min-w-[100px] max-w-[100px]"
            },
            {
                name: "create_dt",
                value: "create_dt",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "update_dt",
                value: "update_dt",
                style: "min-w-[250px] max-w-[250px]"
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
        dispatch(cxixActions.get_dbUpdateList())
    }, [])


    return <>

        <AdvancedTable

            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(AdminManagementActions.getUsersList())
                setmodalHead("DB Update")
                setmodalBody(<DBUpdateForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }}
                name={"Add New"}></Button></>}
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

        <Modal size={"xl"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default DBUpdate;
