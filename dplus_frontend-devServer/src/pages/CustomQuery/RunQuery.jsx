import React, { useEffect, useState } from 'react';
import CommonForm from '../../components/CommonForm';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import CommonActions from '../../store/actions/common-actions';
import { Urls } from '../../utils/url';
import { useLocation, useNavigate } from 'react-router-dom';
import TableJson from '../../components/TableJson';
import { RUN_QUERY } from '../../store/reducers/customQuery-reducer';
import PopupMenu from '../../components/PopupMenu';
import Button from '../../components/Button';
import ComponentActions from '../../store/actions/component-actions';

const RunQuery = () => {

    // let Form = [
    //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
    //     { label: "Custom Queries", value: "", type: "textarea" }
    // ]

    const [OneTime, setOneTime] = useState(true)

    const navigate = useNavigate()

    const { state } = useLocation();

    console.log("statestatestate", state)


    let databaseList = useSelector((state) => {
        console.log(state, "state")
        let interdata = state?.customQuery?.databaseList

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.databaseList
    })

    let runQuery = useSelector((state) => {
        console.log(state, "statestatestate")

        let interdata = state?.customQuery?.runQuery

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.runQuery
    })


    let dispatch = useDispatch()
    let Form = [
        // { label: "Name", name: "name", value: "name", type: "text", props: "", classes: " col-span-1" },
        // { label: "Email", name: "email", value: "", type: "email", classes: "" },
        // { label: "Password", name: "password", value: "", type: "password" },

        {
            label: "DB Server",
            value: "",
            name: "dbServer",
            option: databaseList,
            type: "select",
            required: true,
            props: {
                // valueAsNumber: true,
                onChange: ((e) => {
                    // console.log(e.target.name, "e geeter")

                }),
            },
            classes: "col-span-1"
        }, {
            label: "Custom Queries",
            value: "",
            name: "queries",
            type: "textarea",
            required: true,
            props: {
                onChange: ((e) => {
                    // console.log(e.target.value, "e geeter")

                    // setValue("queries",e.target.name)

                }),
            },
            classes: "col-span-1"
        }
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


    if (state && OneTime) {
        setOneTime(false)
        setValue("queries", state?.queries)
        setValue("dbServer", state?.dbServer)
    }


    const onTableViewSubmit = (data) => {
        console.log(data, "onTableViewSubmitdatadata")
        dispatch(CustomQueryActions.postRunQuery(true, data, () => { }, Urls.querybuilder_runQuery))
    }

    const onTableViewExportCsv = (data) => {
        console.log(data, "onTableViewSubmitdatadata")
        dispatch(CustomQueryActions.postRunQuery(true, data, () => {

            dispatch(ComponentActions.popmenu(""))
        }, Urls.querybuilder_downloadQuery + "/csv"))
    }

    const onTableViewExportExcel = (data) => {
        console.log(data, "onTableViewSubmitdatadata")
        dispatch(CustomQueryActions.postRunQuery(true, data, () => {
            dispatch(ComponentActions.popmenu(""))
        }, Urls.querybuilder_downloadQuery + "/excel"))
    }


    const onTableViewSave = (data) => {
        console.log(data, "onTableViewSavedatadata")
        dispatch(CommonActions.postApiCaller(Urls.querybuilder_saveQuery, data, () => {
            navigate('/custom-query/saved-query-list')
        }))


    }







    useEffect(() => {
        reset({})
        dispatch(RUN_QUERY({}))
        dispatch(CustomQueryActions.getDatabaseList())
    }, [])
    console.log(Form, "Form 11")
    return <>
        <div className='flex flex-col '>
            <div className='w-full flex justify-center'>
                <div className="w-96 bg-center">
                    <CommonForm classes={"grid-cols-1 gap-1"} errors={errors} Form={Form} register={register} setValue={setValue} getValues={getValues} />
                    <div className='flex'>
                        <button onClick={(handleSubmit(onTableViewSubmit))} className='mt-6 mr-2 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Table View</button>
                        {/* <button onClick={(handleSubmit(onTableViewExport))} className='mt-6 mr-2 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Export</button> */}

                        <PopupMenu classes="mt-6 z-[10]" popupname={"Export As"} icon={""} child={<>
                            <div className='flex m-2'>
                                <Button name={"CSV"} onClick={(handleSubmit(onTableViewExportCsv, "csv"))} />
                            </div>

                            <div className='flex m-2'>
                                <Button name={"Excel"} onClick={(handleSubmit(onTableViewExportExcel, "excel"))} />
                            </div>
                        </>
                        } />
                        <button onClick={(handleSubmit(onTableViewSave))} className='mt-6 ml-2 w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Save Query</button>
                    </div>
                </div>
            </div>
            <div className='relative h-[45vh]'>
                <div className=' mt-10 overflow-scroll absolute top-0 bottom-0 left-0 right-0  border-2'>
                    {console.log(runQuery, "runQueryrunQuery")}
                    {runQuery?.status ? runQuery?.status == 200 ?
                        <TableJson headers={runQuery?.columns || []} columns={runQuery?.data || []} /> : <h1>{runQuery?.msg}</h1> : <></>
                    }

                </div>
            </div>
        </div>
    </>


};

export default RunQuery;
