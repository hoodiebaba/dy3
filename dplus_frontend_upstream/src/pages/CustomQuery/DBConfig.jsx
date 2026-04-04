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
import DBConfigForm from './DBConfigForm';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import { ALERTS } from '../../store/reducers/component-reducer';
import CommonActions from '../../store/actions/common-actions';
import { Urls } from '../../utils/url';
import { reset } from 'ol/transform';
import CstmButton from '../../components/CstmButton';
const DBConfig = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(false)



    let dispatch = useDispatch()
    let userList = useSelector((state) => {
        console.log(state, "state state")
        return state?.customQuery?.usersList
    })



    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.customQuery?.dbConfigList

        if(interdata.length>0){
            return interdata[0]["overall_table_count"]
        }else{
            return 0
        }
    })
    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.customQuery?.dbConfigList

        return interdata.map((itm) => {
            let updateditm = {
                ...itm,
                "edit": <CstmButton child={<EditButton name={""} onClick={() => {

                    console.log(itm, "itm,dsadsadadada")
                    setmodalOpen(true)
                    dispatch(CustomQueryActions.getUserList())
                    setmodalBody(<>
                        <DBConfigForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
                        {/* <div className='mx-3'><Button name={"Submit"} classes={""} onClick={(handleSubmit(onTableViewSubmit))} /></div> */}
                    </>)
                }}></EditButton>}/>,

                "delete": <CstmButton child={<DeleteButton name={""} onClick={() => {
                    let msgdata = {
                        show: true,
                        icon: 'warning',
                        buttons: [
                            <Button classes='w-15 bg-green-500' onClick={() => {
                                dispatch(CommonActions.deleteApiCaller(`${Urls.querybuilder_DBConfig}/${itm.uniqueId}`, () => {
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
                name: "DB Name",
                value: "dbName",
                style:""
            },
            {
                name: "DB Server",
                value: "dbServer",
            },
            {
                name: "DB Type",
                value: "dbtype",
            },
            {
                name: "Username",
                value: "username",
            },
            {
                name: "Password",
                value: "password",
            },
            {
                name: "Port",
                value: "port",
            },
            {
                name: "User",
                value: "name",
            },
            {
                name: "Edit",
                value: "edit",
                style:"min-w-[100px] max-w-[100px]"
            },
            {
                name: "Delete",
                value: "delete",
                style:"min-w-[100px] max-w-[100px]"
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: []
    }
    const onSubmit = (data) => {
        let value = data.reseter
        delete data.reseter
        dispatch(CustomQueryActions.getDBConfig(value, objectToQueryString(data)))
    }
    
    useEffect(() => {
        dispatch(CustomQueryActions.getDBConfig())
    }, [])


    return <>
        <AdvancedTable 
            filterAfter={onSubmit}
            tableName={"DBConfigList"}
            headerButton={<><Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(CustomQueryActions.getUserList())
                setmodalBody(<DBConfigForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }} name={"Add New"}></Button></>} 
            table={table} 
            data={dbConfigList} 
            handleSubmit={handleSubmit}
            errors={errors} 
            register={register} 
            setValue={setValue} 
            getValues={getValues} 
            totalCount={dbConfigTotalCount}
        />

        <Modal size={"xl"} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
    </>


};

export default DBConfig;
