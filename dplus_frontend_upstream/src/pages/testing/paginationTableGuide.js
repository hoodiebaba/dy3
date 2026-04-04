const onSubmit = (data) => {
    let value = data.reseter
    delete data.reseter
    dispatch(MtandaoComplaintsActions.getmtandaoComplaintsList(value, objectToQueryString(data)))
}



[
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

let dbConfigTotalCount = useSelector((state) => {
    let interdata = state?.mtandaoComplaints?.mtandaoComplaintsList

    if(interdata.length>0){
        return interdata[0]["overall_table_count"]
    }else{
        return 0
    }
})

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



Api.get({ url: `${Urls.mtandaoComplaints}${args!=""?"?"+args:""}`})

dispatch(MTANDAO_COMPLAINTS_LIST({dataAll,reset}))