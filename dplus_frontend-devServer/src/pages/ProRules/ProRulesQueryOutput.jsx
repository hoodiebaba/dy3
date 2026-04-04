import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import CstmButton from '../../components/CstmButton';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import AdvancedTable from '../../components/AdvancedTable';
import AdminManagementActions from '../../store/actions/adminManagement-actions';
import ToggleButton from '../../components/ToggleButton';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import FileUploader from '../../components/FIleUploader';
import { Urls, WebSocketUrls } from '../../utils/url';
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
import ProRulesForm from './ProRulesForm';
import AutoSuggestion from '../../components/FormElements/AutoSuggestion';
import DatePicking from '../../components/FormElements/DatePicking';
import WebsocketActions from '../../store/actions/websocket-actions';
import TableJson from '../../components/TableJson';
import moment from 'moment';
import { GET_PRO_RULES_OUTPUT } from '../../store/reducers/nokiaPrePost-reducer';



const ProRulesQueryOutput = () => {


    const [modalOpen, setmodalOpen] = useState(true)
    const [modalFullOpen, setmodalFullOpen] = useState(false)
    const [fileOpen, setFileOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)
    const [datalist, setDatalist] = useState([])


    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const urlUniqueId = params.get('uniqueId');

    let data_from_socket = useSelector((state) => {
        // console.log(state, "statedsadsadsadsadasdsada")
        let interdata = state?.websocket?.data_from_socket
        return interdata
    })



    let dispatch = useDispatch()

    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")


        let interdata = state?.nokiaPrePost?.proRulesOutput || []



        if (modalOpen && interdata && interdata.length > 0) {
            setmodalOpen(false)
            interdata.map((itm) => {
                dispatch(WebsocketActions.send_to_socket(WebSocketUrls.proRules, {
                    ...itm,
                    Code: itm.technology
                }, itm.technology + "_" + itm.id))
            })
        }

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
                "detail": data_from_socket[itm.technology + "_" + itm.id] ? <p onClick={()=>{
                    setmodalFullOpen(true)
                    setmodalBody(<TableJson headers={data_from_socket[itm.technology + "_" + itm.id]["columns"]} columns={data_from_socket[itm.technology + "_" + itm.id]["data"]}/>)
                    
                }} style={{color:data_from_socket[itm.technology + "_" + itm.id]["data"][0]?.["Colour"]}}>{data_from_socket[itm.technology + "_" + itm.id]["data"][0]?.["ValueAvg"]}</p>  : "Processing......",
                "issues": data_from_socket[itm.technology + "_" + itm.id] ? <p onClick={()=>{
                    setmodalFullOpen(true)
                    setmodalBody(<TableJson headers={data_from_socket[itm.technology + "_" + itm.id]["columns"]} columns={data_from_socket[itm.technology + "_" + itm.id]["data"]}/>)
                }} style={{color:data_from_socket[itm.technology + "_" + itm.id]["data"][0]?.["IssuesColor"]}}>{data_from_socket[itm.technology + "_" + itm.id]["data"][0]?.["Issues"]}</p>  : "Processing......",
                "edit": <CstmButton child={<EditButton name={""} onClick={() => {

                    console.log(itm, "itm,dsadsadadada")
                    setmodalOpen(true)
                    dispatch(AdminManagementActions.getUsersList())
                    setmodalHead("Edit Pro Rules")
                    setmodalBody(<>
                        <ProRulesForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={false} formValue={itm} />
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
        let interdata = state?.nokiaPrePost?.proRulesOutput

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
                name: "Technology",
                value: "technology",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Rule Name",
                value: "rule_name",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Detail",
                value: "detail",
                style: "min-w-[250px] max-w-[250px]"
            },
            {
                name: "Issues",
                value: "issues",
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
        dispatch(nokiaPrePostActions.getProRules(value, objectToQueryString(data)))
    }


    let uniquePhysicalIdList = useSelector((state) => {
        return state?.nokiaPrePost?.uniquePhysicalId
    })


    const hitDatatoGetOutput = (data) => {
        console.log(data, "hitDatatoGetOutputdatadata")

        // setmodalOpen(true)
        dispatch(GET_PRO_RULES_OUTPUT({ dataAll: [], reset: true }));
        dispatch(nokiaPrePostActions.ProRulesOutput(data, true, () => {
            setmodalOpen(true)
        }))
    }
    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")




        // dasdsadsadasdas
        dispatch(nokiaPrePostActions.postSubmit(Urls.PrePostBulkUpload, data, () => {
            setFileOpen(false)

            dispatch(nokiaPrePostActions.getnokiaprepost())
        }))



    }


    let dsadsa = 0

    useEffect(() => {

        if(urlUniqueId!=null){
            const twoDaysAgo = moment().subtract(2, 'days');
            const twoDaysAgoformattedDate = twoDaysAgo.format('YYYY-MM-DD');

            const oneDaysAgo = moment().subtract(1, 'days');
            const oneDaysAgoformattedDate = oneDaysAgo.format('YYYY-MM-DD');

            console.log(twoDaysAgoformattedDate, "twoDaysAgoformattedDate")
            console.log(oneDaysAgoformattedDate, "oneDaysAgoformattedDate")

            setValue("fr_pre_date",oneDaysAgo)
            let datuewa = {
                fr_phy_id: urlUniqueId,
                fr_pre_date: oneDaysAgoformattedDate
            }

            dispatch(nokiaPrePostActions.ProRulesOutput(datuewa, true, () => {}))
        }
        dispatch(nokiaPrePostActions.getuniquephysicalid())
    }, [dsadsa])


    let idSelector = [
        { label: "Select Physical ID", name: "fr_phy_id", value: "Select", type: "text", datalist: "listData",defaultValue:urlUniqueId, option: uniquePhysicalIdList, props: "", required: true, },
        { label: "Date", name: "fr_pre_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true },
        { label: "Post Date", name: "fr_post_date", type: "datetime", formattype: "date", format: "yyyy-MM-dd", formatop: "yyyy-MM-DD", required: true }
    ]


    console.log(datalist, "dbConfigListdbConfigList")

    return <>

        {dbConfigList && dbConfigList.length > 0 ? <>
            <AdvancedTable
                showHeaderRight={true}
                headerRightButton={
                    <>
                        <div className='flex place-items-end'>
                            <div className='mx-2'>
                                <label className='w-full'>{idSelector[0]["label"]}</label>
                                <AutoSuggestion itm={idSelector[0]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                            </div>
                            <div className='mx-2'>
                                <label className='w-full'>{idSelector[1]["label"]}</label>
                                <DatePicking itm={idSelector[1]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                            </div>
                            <div className='mx-2'>
                                <Button name={"Submit"} onClick={handleSubmit(hitDatatoGetOutput)} />
                            </div>

                        </div>
                    </>
                }

                headerButton={<>


                    <div className='flex gap-0.5'>
                        {/* <Button
                        classes='w-22'
                        onClick={(e) => {
                            setmodalOpen(prev => !prev)
                            dispatch(AdminManagementActions.getUsersList())
                            setmodalHead("New Pro Rules")
                            setmodalBody(<ProRulesForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
                        }}
                        name={"Add Pro Rules"}></Button> */}
                        {/* 
                    <Button
                        classes={"w-28 "}
                        onClick={(e) => {
                            setFileOpen(prev => !prev)
                        }}
                        name={"Upload File"}></Button> */}




                    </div>
                </>}
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

            <FileUploader fileUploadUrl={Urls.PrePostBulkUpload} isOpen={fileOpen} onTableViewSubmit={onTableViewSubmit} setIsOpen={setFileOpen} />
            <Modal size={"xl"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />
            <Modal size={"xl"} modalHead={modalHead} children={modalBody} isOpen={modalFullOpen} setIsOpen={setmodalFullOpen} />

            {/* <CommonForm/> */}
        </> : <>
            <>
                <div className='flex place-items-end'>
                    <div className='mx-2'>
                        <label className='w-full'>{idSelector[0]["label"]}</label>
                        <AutoSuggestion itm={idSelector[0]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                    </div>
                    <div className='mx-2'>
                        <label className='w-full'>{idSelector[1]["label"]}</label>
                        <DatePicking itm={idSelector[1]} errors={errors} handleSubmit={handleSubmit} setValue={setValue} getValues={getValues} register={register} />
                    </div>
                    <div className='mx-2'>
                        <Button name={"Filter"} onClick={handleSubmit(hitDatatoGetOutput)} />
                    </div>

                </div>
            </>
        </>}
    </>


};

export default ProRulesQueryOutput;
