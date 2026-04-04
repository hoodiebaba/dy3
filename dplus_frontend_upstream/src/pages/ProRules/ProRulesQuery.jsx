// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as Unicons from '@iconscout/react-unicons';
// import { useDispatch, useSelector } from 'react-redux';
// import CstmButton from '../../components/CstmButton';
// import Button from '../../components/Button';
// import Modal from '../../components/Modal';
// import AdvancedTable from '../../components/AdvancedTable';
// import AdminManagementActions from '../../store/actions/adminManagement-actions';
// import ToggleButton from '../../components/ToggleButton';
// import EditButton from '../../components/EditButton';
// import DeleteButton from '../../components/DeleteButton';
// import FileUploader from '../../components/FIleUploader';
// import { Urls } from '../../utils/url';
// import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
// import ProRulesForm from './ProRulesForm';
// import { objectToQueryString } from '../../utils/commonFunnction';
// // for delete 
// import CommonActions from '../../store/actions/common-actions';
// import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';

// const ProRulesQuery = () => {


//     const [modalOpen, setmodalOpen] = useState(false)
//     const [fileOpen, setFileOpen] = useState(false)
//     const [modalBody, setmodalBody] = useState(<></>)
//     const [modalHead, setmodalHead] = useState(<></>)
    
//     // added for delete
//     const [confirmOpen, setConfirmOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);

//     let dispatch = useDispatch()

//     let dbConfigList = useSelector((state) => {
//         console.log(state, "state state")
//         let interdata = state?.nokiaPrePost?.proRules

//         return interdata.map((itm) => {
//             let updateditm = {
//                 ...itm,
//                 "status": <CstmButton child={<ToggleButton onChange={(e) => {

//                     console.log(e.target.checked, "e.target.checked")

//                     let data = {
//                         "enabled": e.target.checked ? 1 : 0
//                     }
//                     dispatch(AlertConfigurationActions.patchAlertConfig(true, data, () => {
//                         // alert(e.target.checked)
//                         e.target.checked = e.target.checked
//                     }, itm.id))

//                     // if(itm.enabled==0){
//                     //     itm.enabled=1
//                     // }else{
//                     //     itm.enabled=0
//                     // }
//                     // itm.enabled=itm.enabled==0?1:0

//                     console.log(itm.enabled, "itm.enabled")




//                 }} defaultChecked={itm.enabled == 1 ? true : false}></ToggleButton>} />,

//                 "edit": (
//                 <CstmButton onClick={() => {
//                     console.log(itm, "edit clicked");
//                     setmodalOpen(true);
//                     dispatch(AdminManagementActions.getUsersList());
//                     setmodalHead("Edit Pro Rules");
//                     setmodalBody(
//                         <ProRulesForm
//                         isOpen={modalOpen}
//                         setIsOpen={setmodalOpen}
//                         resetting={false}
//                         formValue={itm}
//                         />
//                     );
//                 }}>
//                     <EditButton />
//                 </CstmButton>
//                 ),

//                 "delete": (
//                         <CstmButton onClick={() => onDeleteClick(itm)}>
//                             <DeleteButton />
//                         </CstmButton>
//                     )

// /*                 "delete": 
//                     <CstmButton child={<DeleteButton name={""} onClick={() => { 
//                         let msgdata = { 
//                             show: true, 
//                             icon: 'warning', 
//                             buttons: [      
//                                 <Button classes='w-15 bg-green-500' onClick={() => { 
//                                             dispatch(CommonActions.deleteApiCaller(${Urls.alertConfiguration_configureAlert}/${itm.uniqueId}, () => { 
//                                                 dispatch(CustomQueryActions.getDBConfig()) 
//                                                 dispatch(ALERTS({ show: false })) 
//                                             })) 
//                                         }} name={"OK"} />,
//                                 <Button classes='w-24' onClick={() =>  { 
//                                         dispatch(ALERTS({ show: false })) 
//                                     }} name={"Cancel"} /> 
//                          ], 
//                             text: "Are you sure you want to Delete?" 
//                         } 
//                         dispatch(ALERTS(msgdata)) 
//                     }}></DeleteButton>} /> 
// */
//             }
//             return updateditm
//         });
//     })



//     let dbConfigTotalCount = useSelector((state) => {
//         let interdata = state?.nokiaPrePost?.proRules

//         if (interdata.length > 0) {
//             return interdata[0]["overall_table_count"]
//         } else {
//             return 0
//         }
//     })

//     // let Form = [
//     //     { label: "DB Server", value: "", option: ["Please Select Your DB Server"], type: "select" },
//     //     { label: "Custom Queries", value: "", type: "textarea" }
//     // ]

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         setValues,
//         getValues,
//         formState: { errors },
//     } = useForm()

//     let table = {
//         columns: [
            
//             {
//                 name: "Report",
//                 value: "fromReport",
//                 style: "min-w-[80px] max-w-[80px]"
//             },
//             {
//                 name: "Technology",
//                 value: "technology",
//                 style: "min-w-[80px] max-w-[80px]"
//             },
//             {
//                 name: "Rule Name",
//                 value: "rule_name",
//                 style: "min-w-[120px] max-w-[120px]"
//             },
//             {
//                 name: "Query",
//                 value: "query",
//                 style: "min-w-[300px] max-w-[300px]"
//             },
//             {
//                 name: "Edit",
//                 value: "edit",
//                 style: "min-w-[40px] max-w-[40px]"
//             },
//             {
//                 name: "Delete",
//                 value: "delete",
//                 style: "min-w-[40px] max-w-[40px]"
//             }
//         ],
//         properties: {
//             rpp: [10, 20, 50, 100]
//         },
//         filter: [
//             {
//                 label: "Status",
//                 type: "select",
//                 name: "fromReport",
//                 option: [
//                     {
//                         label: "Both",
//                         value: ""
//                     },
//                     {
//                         label: "Site Analytics",
//                         value: "Site Analytics"
//                     },
//                     {
//                         label: "Cell Analytics",
//                         value: "Cell Analytics"
//                     }
//                 ],
//                 props: {

//                 }
//             }
//         ]
//     }


//     const onSubmit = (data) => {
//         let value = data.reseter
//         delete data.reseter
//         dispatch(nokiaPrePostActions.getProRules(value, objectToQueryString(data)))
//     }

//     const onTableViewSubmit = (data) => {
//         console.log(data, "datadata")




//         // dasdsadsadasdas
//         dispatch(nokiaPrePostActions.postSubmit(Urls.PrePostBulkUpload, data, () => {
//             setFileOpen(false)

//             dispatch(nokiaPrePostActions.getnokiaprepost())
//         }))



//     }

//     // On delete icon click → ONLY open modal
//     const onDeleteClick = (itm) => {
//         setSelectedItem(itm);
//         setConfirmOpen(true);
//     };


//     // function to handle delete click added
//     /*  const handleDeleteClick = (itm) => {
//       console.log("DELETE CLICKED", itm);
 
//         if (!itm?.id) {
//             console.error("Invalid item", itm);
//             return;
//         }

//         if (!window.confirm("Are you sure you want to Delete?")) return; */
//         const handleDelete = (itm) => {

//         dispatch(
//             CommonActions.deleteApiCaller(
//              `${Urls.proRules}/${itm.id}`,
//                 () => {
//             console.log("DELETE SUCCESS → REFRESH WITH RESET");
//         dispatch(nokiaPrePostActions.getProRules(true));
//         }
//      )
//     );
//     };


//     useEffect(() => {
//         dispatch(nokiaPrePostActions.getProRules())
//     }, [])


//     return <>

//         <AdvancedTable

//             headerButton={<>
//                 <div className='flex gap-0.5'>
//                     <Button
//                         classes='w-22'
//                         onClick={(e) => {
//                             setmodalOpen(prev => !prev)
//                             dispatch(AdminManagementActions.getUsersList())
//                             setmodalHead("New Pro Rules")
//                             setmodalBody(<ProRulesForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
//                         }}
//                         name={"Add Pro Rules"}></Button>
//                     {/* 
//                     <Button
//                         classes={"w-28 "}
//                         onClick={(e) => {
//                             setFileOpen(prev => !prev)
//                         }}
//                         name={"Upload File"}></Button> */}


//                 </div>
//             </>}
//             table={table}
//             filterAfter={onSubmit}
//             tableName={"UserListTable"}
//             handleSubmit={handleSubmit}
//             data={dbConfigList}
//             errors={errors}
//             register={register}
//             setValue={setValue}
//             getValues={getValues}
//             totalCount={dbConfigTotalCount}
//         />

//         <FileUploader fileUploadUrl={Urls.PrePostBulkUpload} isOpen={fileOpen} onTableViewSubmit={onTableViewSubmit} setIsOpen={setFileOpen} />
//         <Modal size={"lg"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

//         {/* <CommonForm/> */}
//         <Modal
//             size="modal"
//             modalHead="Confirm Delete"
//             isOpen={confirmOpen}
//             setIsOpen={setConfirmOpen}
//             closeButton={false}
//             >
//             <p className="text-sm mb-4">
//                 Are you sure you want to delete this rule?
//             </p>

//             <div className="flex justify-end gap-2">
//                 <Button
//                 classes="w-20"
//                 name="Cancel"
//                 onClick={() => setConfirmOpen(false)}
//                 />
//                 <Button
//                 classes="w-20 bg-red-600"
//                 name="Delete"
//                 onClick={() => {
//                     handleDelete(selectedItem);
//                     setConfirmOpen(false);
//                 }}
//                 />
//             </div>
//         </Modal>

//     </>


// };

// export default ProRulesQuery;


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
import { Urls } from '../../utils/url';
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions';
import ProRulesForm from './ProRulesForm';
import { objectToQueryString } from '../../utils/commonFunnction';
// for delete 
import CommonActions from '../../store/actions/common-actions';
import AlertConfigurationActions from '../../store/actions/alertConfiguration-actions';

const ProRulesQuery = () => {


    const [modalOpen, setmodalOpen] = useState(false)
    const [fileOpen, setFileOpen] = useState(false)
    const [modalBody, setmodalBody] = useState(<></>)
    const [modalHead, setmodalHead] = useState(<></>)
    
    // added for delete
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    let dispatch = useDispatch()

    let dbConfigList = useSelector((state) => {
        console.log(state, "state state")
        let interdata = state?.nokiaPrePost?.proRules

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

                "edit": (
                <CstmButton onClick={() => {
                    console.log(itm, "edit clicked");
                    setmodalOpen(true);
                    dispatch(AdminManagementActions.getUsersList());
                    setmodalHead("Edit Pro Rules");
                    setmodalBody(
                        <ProRulesForm
                        isOpen={modalOpen}
                        setIsOpen={setmodalOpen}
                        resetting={false}
                        formValue={itm}
                        />
                    );
                }}>
                    <EditButton />
                </CstmButton>
                ),

                "delete": (
                        <CstmButton onClick={() => onDeleteClick(itm)}>
                            <DeleteButton />
                        </CstmButton>
                    )

/*                 "delete": 
                    <CstmButton child={<DeleteButton name={""} onClick={() => { 
                        let msgdata = { 
                            show: true, 
                            icon: 'warning', 
                            buttons: [      
                                <Button classes='w-15 bg-green-500' onClick={() => { 
                                            dispatch(CommonActions.deleteApiCaller(${Urls.alertConfiguration_configureAlert}/${itm.uniqueId}, () => { 
                                                dispatch(CustomQueryActions.getDBConfig()) 
                                                dispatch(ALERTS({ show: false })) 
                                            })) 
                                        }} name={"OK"} />,
                                <Button classes='w-24' onClick={() =>  { 
                                        dispatch(ALERTS({ show: false })) 
                                    }} name={"Cancel"} /> 
                         ], 
                            text: "Are you sure you want to Delete?" 
                        } 
                        dispatch(ALERTS(msgdata)) 
                    }}></DeleteButton>} /> 
*/
            }
            return updateditm
        });
    })



    let dbConfigTotalCount = useSelector((state) => {
        let interdata = state?.nokiaPrePost?.proRules

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
                name: "Report",
                value: "fromReport",
                style: "min-w-[80px] max-w-[80px]"
            },
            {
                name: "Technology",
                value: "technology",
                style: "min-w-[80px] max-w-[80px]"
            },
            {
                name: "Rule Name",
                value: "rule_name",
                style: "min-w-[120px] max-w-[120px]"
            },
            {
                name: "Query",
                value: "query",
                style: "min-w-[300px] max-w-[300px]"
            },
            {
                name: "Edit",
                value: "edit",
                style: "min-w-[40px] max-w-[40px]"
            },
            {
                name: "Delete",
                value: "delete",
                style: "min-w-[40px] max-w-[40px]"
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            {
                label: "Status",
                type: "select",
                name: "fromReport",
                option: [
                    {
                        label: "Both",
                        value: ""
                    },
                    {
                        label: "Site Analytics",
                        value: "Site Analytics"
                    },
                    {
                        label: "Cell Analytics",
                        value: "Cell Analytics"
                    }
                ],
                props: {

                }
            }
        ]
    }


    const onSubmit = (data) => {
        let value = data.reseter
        delete data.reseter
        dispatch(nokiaPrePostActions.getProRules(value, objectToQueryString(data)))
    }

    const onTableViewSubmit = (data) => {
        console.log(data, "datadata")




        // dasdsadsadasdas
        dispatch(nokiaPrePostActions.postSubmit(Urls.PrePostBulkUpload, data, () => {
            setFileOpen(false)

            dispatch(nokiaPrePostActions.getnokiaprepost())
        }))



    }

    // On delete icon click → ONLY open modal
    const onDeleteClick = (itm) => {
        setSelectedItem(itm);
        setConfirmOpen(true);
    };


    // function to handle delete click added
    /*  const handleDeleteClick = (itm) => {
      console.log("DELETE CLICKED", itm);
 
        if (!itm?.id) {
            console.error("Invalid item", itm);
            return;
        }

        if (!window.confirm("Are you sure you want to Delete?")) return; */
        const handleDelete = (itm) => {

        dispatch(
            CommonActions.deleteApiCaller(
             `${Urls.proRules}/${itm.id}`,
                () => {
            console.log("DELETE SUCCESS → REFRESH WITH RESET");
        dispatch(nokiaPrePostActions.getProRules(true));
        }
     )
    );
    };


    useEffect(() => {
        dispatch(nokiaPrePostActions.getProRules())
    }, [])


    return <>

        <AdvancedTable

            headerButton={<>
                <div className='flex gap-0.5'>
                    <Button
                        classes='w-22'
                        onClick={(e) => {
                            setmodalOpen(prev => !prev)
                            dispatch(AdminManagementActions.getUsersList())
                            setmodalHead("New Pro Rules")
                            setmodalBody(<ProRulesForm isOpen={modalOpen} setIsOpen={setmodalOpen} resetting={true} formValue={{}} />)
                        }}
                        name={"Add Pro Rules"}></Button>
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
        <Modal size={"lg"} modalHead={modalHead} children={modalBody} isOpen={modalOpen} setIsOpen={setmodalOpen} />

        {/* <CommonForm/> */}
        <Modal
            size="modal"
            modalHead="Confirm Delete"
            isOpen={confirmOpen}
            setIsOpen={setConfirmOpen}
            closeButton={false}
            >
            <p className="text-sm mb-4">
                Are you sure you want to delete this rule?
            </p>

            <div className="flex justify-end gap-2">
                <Button
                classes="w-20"
                name="Cancel"
                onClick={() => setConfirmOpen(false)}
                />
                <Button
                classes="w-20 bg-red-600"
                name="Delete"
                onClick={() => {
                    handleDelete(selectedItem);
                    setConfirmOpen(false);
                }}
                />
            </div>
        </Modal>

    </>


};

export default ProRulesQuery;
