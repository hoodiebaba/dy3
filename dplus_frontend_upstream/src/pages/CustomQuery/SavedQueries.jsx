import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import moment from 'moment';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import Button from '../../components/Button';
import AdvancedTable from '../../components/AdvancedTable';
import { useNavigate } from 'react-router-dom';
import CommonActions from '../../store/actions/common-actions';
import { Urls } from '../../utils/url';
import SavedQueriesForm from '../../components/SavedQueriesForm';
import CstmButton from '../../components/CstmButton';
const SavedQueries = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const navigate = useNavigate()
    let dispatch = useDispatch()


    const {
        register,
        handleSubmit,
        watch,
        onSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors },
    } = useForm()


    let runQuery = useSelector((state) => {
        console.log(state, "statestatestate")

        let interdata = state?.customQuery?.runQuery

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.runQuery
    })


    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.customQuery?.savedQueryList

        if(interdata.length>0){
            return interdata[0]["overall_table_count"]
        }else{
            return 0
        }
    })

    let Form = [
        // { label: "Datetime Key", name: "dateTimeKey", type: "text", required: true, filtering: "@" },
        { label: "Start Date", name: "startDate", type: "datetime", required: true, filtering: "startingdate" },
        { label: "End Date", name: "endDate", type: "datetime", required: true, filtering: "endingdate" },
    ]





    const onTableView = (data) => {
        data.queries=data.queries.replace("startingdate",`'${data.startDate.replace("T"," ")}'`)
        data.queries=data.queries.replace("endingdate",`'${data.endDate.replace("T"," ")}'`)


        console.log(data, "datadata")


        navigate("/custom-query/run-query", {
            state: data
        })


        
        // dispatch(CustomQueryActions.postRunQuery(true, data, () => {
        //     setmodalOpen(false)
        // }, Urls.querybuilder_runQuery))

    }

    let savedQueryList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.customQuery?.savedQueryList
        console.log(interdata, "interdatainterdata")

        return interdata.map((itm) => {
            let updateditm = {
                ...itm,
                "runQueryButton": <div className='flex justify-center'>
                    <CstmButton child={<Button classes='w-10' name={"Run"} onClick={() => {

                        if (Form.filter((formitm) => { if (itm.queries.includes(formitm.filtering)) { return formitm } }).length > 0) {

                            setmodalOpen(true)
                            reset()
                            console.log(itm, "itttttttm")
                            setValue("queries", itm.queries)
                            setValue("dbServer", itm.id)

                            // <SavedQueriesForm itm={itm} Form={Form} errors={errors} register={register} setValue={setValue} getValues={getValues} handleSubmit={handleSubmit} onTableView={onTableView}/>
                            setmodalBody(<>
                                <div>
                                    <CommonForm classes={"grid-cols-1 gap-2 p-4"} errors={errors} Form={Form.filter((formitm) => {
                                        if (itm.queries.includes(formitm.filtering)) {
                                            console.log(formitm, "formitmformitm")
                                            return formitm
                                        }
                                    })} register={register} setValue={setValue} getValues={getValues} />
                                    <div className='mx-3'>

                                        <Button classes={"mt-2 "} onClick={handleSubmit(onTableView)} name="Submit" />

                                    </div>
                                    <div className='w-full flex mt-3 justify-center'>
                                        {console.log(runQuery, "runQueryrunQuery")}
                                        {runQuery?.status ? runQuery?.status == 200 ?
                                            <TableJson headers={runQuery?.columns || []} columns={runQuery?.data || []} /> : <h1>{runQuery?.msg}</h1> : <></>
                                        }

                                    </div>
                                </div>
                            </>)
                        } else {
                            navigate("/custom-query/run-query", {
                                state: {...itm,dbServer:itm.id}
                            })
                        }
                    }
                    }></Button >}/>
                </div >
            }
            return updateditm
        })
    })
    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]

    let table = {
        columns: [
            {
                name: "DB Name",
                value: "dbName",
            },
            {
                name: "DB Server",
                value: "dbServer"
            },
            {
                name: "Query",
                value: "queries"
            }, {
                name: "Run Query Button",
                value: "runQueryButton",
                style:"min-w-[150px] max-w-[150px]"

            }

        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            
        ]
    }
    
    useEffect(() => {
        dispatch(CustomQueryActions.getSavedQuery(true))
        // dispatch(CommonActions.getApiCaller("/checker"))
        // dispatch(CommonActions.getApiCaller("/checker1"))
        // dispatch(CommonActions.getApiCaller("/checker2"))

        // getApiCaller
    }, [])


    const onTableViewSubmit = (data) => {
        console.log(data, "onTableViewSubmitdatadata")

        dispatch(CustomQueryActions.postRunQuery(true, data, () => {
        }))

    }

    return <>
        <AdvancedTable 
            filterAfter={onSubmit}
            tableName={"SavedQueriesList"}
            headerButton={<><Button onClick={(e) => {
                navigate("/custom-query/run-query")
            }} name={"Add New"}></Button></>} 
            table={table} 
            data={savedQueryList} 
            handleSubmit={handleSubmit}
            errors={errors} 
            register={register} 
            setValue={setValue} 
            getValues={getValues} 
            totalCount={dbConfigTotalCount}
        />

        <Modal size={"xl"} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />
    </>


};

export default SavedQueries;
