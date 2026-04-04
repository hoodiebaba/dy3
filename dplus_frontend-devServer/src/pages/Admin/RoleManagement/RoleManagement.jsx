import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import AdvancedTable from '../../../components/AdvancedTable';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import CstmButton from '../../../components/CstmButton';
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import ToggleButton from '../../../components/ToggleButton';
import AdminManagementActions from '../../../store/actions/adminManagement-actions';
import RoleManagementForm from './RoleManagementForm';



const RoleManagement = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)



    let dispatch = useDispatch()
    let dbConfigList = useSelector((state) => {
        // console.log(state, "state state")
        let interdata = state?.adminManagement?.roleList

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
                    dispatch(AdminManagementActions.getUsersList())
                    setmodalHead("Edit User")
                    setmodalBody(<>
                        <RoleManagementForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
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

    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.adminManagement?.roleList

        if (interdata.length > 0) {
            return interdata[0]["overall_table_count"]
        } else {
            return 0
        }
    })

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
                name: "Role",
                value: "label",
                style: "min-w-[100px] max-w-[100px]"
            },
            {
                name: "Module Access",
                value: "permission"
            },
            {
                name: "Permission",
                value: "edit",
                style: "min-w-[100px] max-w-[200px]"
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
        dispatch(AdminManagementActions.getRoleList(value, objectToQueryString(data)))
    }

    useEffect(() => {
        dispatch(AdminManagementActions.getRoleList())
    }, [])


    return <>
        <AdvancedTable

            filterAfter={onSubmit}
            tableName={"RoleManagement"}
            handleSubmit={handleSubmit}
            headerButton={<>
                {/* <Button onClick={(e) => {
                setmodalOpen(prev => !prev)
                dispatch(AdminManagementActions.getRoleList())
                setmodalHead("New Role")
                setmodalBody(<RoleManagementForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
            }} name={"Add New"}></Button> */}
            </>}
            table={table}
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

export default RoleManagement;
