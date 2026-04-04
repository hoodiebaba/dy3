import React, { useEffect, useState } from 'react';
import 'react-querybuilder/dist/query-builder.css'; // Import the library styles
import QueryBuilder from 'react-querybuilder';
import { useForm } from 'react-hook-form';
import CommonForm from '../../components/CommonForm';
import AuthActions from '../../store/actions/auth-actions';
import CustomQueryActions from '../../store/actions/customQuery-actions';
import { useDispatch, useSelector } from 'react-redux';
import Multiselect from 'multiselect-react-dropdown';
import QueryItem from './QueryItem';
import * as Unicons from '@iconscout/react-unicons';
import { all_command_type, all_command_type_wise, sql_data_generator, where_all_command_type } from '../../utils/queryBuilder';
import { useNavigate } from 'react-router-dom';
import { TABLES_LIST } from '../../store/reducers/customQuery-reducer';


// const QueryBuilderComponent = () => {
//   const [query, setQuery] = useState(null);

//   const executeQuery = () => {
//     if (query) {
//       // Send the generated query to the backend for execution
//       // You can use fetch or axios to make a request to the Python backend
//       // Include the generated query in the request body
//     }
//   };

//   return (
//     <div>
//       <QueryBuilder
//         fields={[
//           { name: 'column1', label: 'Column 1' },
//           { name: 'column2', label: 'Column 2' },
//           // Add more fields as needed
//         ]}
//         onQueryChange={(query) => setQuery(query)}
//       />
//       <button onClick={executeQuery}>Execute Query</button>
//       <div>
//         <strong>Generated Query:</strong> {query ? JSON.stringify(query, null, 2) : 'No query'}
//       </div>
//     </div>
//   );
// };

const AdvancedQueryBuilderComponent = () => {

  const dispatch = useDispatch()

  const [oneLoad, setOneLoad] = useState(false)
  const [nestfilter, setnestfilter] = useState({})
  const [onestfilter, setonestfilter] = useState({})
  const [gopen, SetgOpen] = useState([])
  const [dataQuery, SetdataQuery] = useState("Select * from values;")
  const [filtering, setFiltering] = useState("Select * from values;")
  const [managingFilter, setManagingFilter] = useState([])
  const [upmanagingFilter, setupManagingFilter] = useState([])
  const [countform, setcountform] = useState([1])
  const [conditioncountform, setconditioncountform] = useState([])
  const [countformtwo, setcountformtwo] = useState([])

  // console.log(filtering, "filteringfiltering")


  const navigate = useNavigate()
  const [dataValue, setDataValue] = useState([])
  useSelector((state) => {
    console.log(state, "state")
  })
  let databaseList = useSelector((state) => {
    return state?.customQuery?.databaseList
  })
  let dboList = useSelector((state) => {
    return state?.customQuery?.dboList
  })


  let tableList = useSelector((state) => {
    let data = {}

    // console.log(state?.customQuery?.tableList, "state?.customQuery?.tableList")
    if (oneLoad && state?.customQuery?.tableList?.d1) {
      setManagingFilter(state?.customQuery?.tableList.d1)
      setupManagingFilter(state?.customQuery?.tableList.d1)
      setDataValue(data)
      setOneLoad(false)
    }

    // console.log(data, "dasdasasdsa")
    // }
    return state?.customQuery?.tableList
  })
  let sqlQuerData = useSelector((state) => {
    return state?.customQuery?.generatedSqlQuery
  })
  let Form = [
    {
      label: "Select Server",
      value: "Select",
      option: databaseList,
      type: "select",
      name: "ServerSelection",
      required: false,
      props: {
        onChange: ((e) => {
          setOneLoad(true)
          setupManagingFilter([])
          setManagingFilter([])
          setValue("dboSelection","Select")

          dispatch(TABLES_LIST({}))
          // dispatch(CustomQueryActions.resetTablesList())
          dispatch(CustomQueryActions.getdboList(true, e.target.value, () => { }))
        }),
      },

      classes: "col-span-1"
    }, {
      label: "Select Schema",
      value: "Select",
      option: dboList,
      type: "select",
      name: "dboSelection",
      required: false,
      props: {
        onChange: ((e) => {
          setOneLoad(true)
          setupManagingFilter([])
          setManagingFilter([])
          // dispatch(CustomQueryActions.resetTablesList())
          dispatch(CustomQueryActions.getTablesList(true, e.target.value, () => { }))
        }),
      },

      classes: "col-span-1"
    }
  ]
  let searchForm = [

    {
      label: "Table Name",
      name: "searchTablename",
      value: "",
      type: "text",
      props: {
        onChange: ((e) => {
          // console.log(managingFilter, "managingFilter dataValuedataValue")

          let dtew = managingFilter.filter(itm => itm.name.toLowerCase().includes(e.target.value.toLowerCase()))
          setupManagingFilter(dtew)
          // console.log(dtew, "dtew dataValuedataValue")
          // console.log(dataValue, "dataValuedataValue")
        }),
      },
      classes: " col-span-1"
    },
  ]
  let ordermultiForm = [
    {
      label: "Select Column",
      value: "",
      singleSelect: true,
      option: tableList?.d2,
      name: "order" + "column",
      type: "muitiSelect",
      onChanging: ((e) => {

      }),
      props: {
        onSelect: (e, a, b, c) => { console.log({ e, a, b, c }) }
      },
      classes: "col-span-1  "
    },
    {
      label: "Condition",
      value: "",
      name: "order" + "condition",
      option: all_command_type,
      type: "select",
      required: true,
      props: {
        onChange: ((e) => {
          // console.log(e.target.name, "e geeter")
          let tar = e.target.name
          let val = e.target.value
          setonestfilter(prev => ({
            ...prev,
            [tar]: val
          }));
        }),
      },
      classes: "col-span-1"
    },
    {
      label: "Expression",
      value: "",
      option: [],
      type: "select",
      name: "order" + "expression",
      required: true,
      onChanging: ((e) => {
        // setOneLoad(true)
        // dispatch(CustomQueryActions.getTablesList(e.target.value, () => { }))
      }),
      props: {

      },
      classes: "col-span-1"
    },
    {
      label: "Value",
      value: "",
      type: "hidden",
      name: "order" + "formovalue",
      singleSelect: true,
      option: tableList?.d2,
      props: {
        onSelect: (e, a, b, c) => { console.log({ e, a, b, c }) }
      },
      classes: "col-span-1"
    }
  ]



  let conditionmultiForm = [
    {
      label: "Select Column",
      value: "",
      singleSelect: true,
      option: tableList?.d2,
      name: "where" + "column",
      type: "muitiSelect",
      onChanging: ((e) => {

      }),
      props: {
        onSelect: (e, a, b, c) => { console.log({ e, a, b, c }) }
      },
      classes: "col-span-1  "
    },
    {
      label: "Condition",
      value: "",
      name: "where" + "condition",
      option: where_all_command_type,
      type: "select",
      required: true,
      props: {
        onChange: ((e) => {
          // console.log(e.target.name, "e geeter")
          let tar = e.target.name
          let val = e.target.value
          setnestfilter(prev => ({
            ...prev,
            [tar]: val
          }));



          // nestfilter[e.target.name]= e.target.value


          // setOneLoad(true)
          // dispatch(CustomQueryActions.getTablesList(e.target.value, () => { }))
        }),
      },
      classes: "col-span-1"
    },
    {
      label: "Expression",
      value: "",
      option: [],
      type: "select",
      name: "where" + "expression",
      required: true,
      onChanging: ((e) => {
        // setOneLoad(true)
        // dispatch(CustomQueryActions.getTablesList(e.target.value, () => { }))
      }),
      props: {

      },
      classes: "col-span-1"
    },
    {
      label: "Value",
      value: "",
      type: nestfilter == "joins" ? "muitiSelect" : "text",
      name: "where" + "formovalue",
      singleSelect: true,
      option: tableList?.d2,
      classes: "col-span-1"
    }
  ]

  let conditionchildmultiForm = [
    {
      label: "Condition",
      value: "",
      option: [
        {
          "label": "Select",
          "value": "blank"
        }, {
          "label": "AND",
          "value": "AND"
        },
        {
          "label": "OR",
          "value": "OR"
        }
      ],
      type: "select",
      name: "where" + "twocondition",
      required: true,
      // onChanging: ((e) => {
      //   // setOneLoad(true)
      //   // dispatch(CustomQueryActions.getTablesList(e.target.value, () => { }))
      // }),
      // props: {

      // },
      classes: "col-span-1"
    },
  ]


  // console.log("nestfilter", nestfilter, "nestfilter")

  all_command_type_wise[nestfilter]
  let multiFormtwo = [
    {
      label: "Column",
      value: "",
      singleSelect: true,
      option: tableList?.d2,
      type: "muitiSelect",
      required: true,
      onChanging: ((e) => {

      }),
      classes: "col-span-1  "
    }, {
      label: "Expression",
      value: "",
      name: "expression",
      option: [
        {
          "label": "Not sorted",
          "value": "Not sorted"
        },
        {
          "label": "Ascending",
          "value": "Ascending"
        },
        {
          "label": "Descending",
          "value": "Descending"
        }
      ],
      type: "select",
      required: true,
      onChanging: ((e) => {
        // setOneLoad(true)
        // dispatch(CustomQueryActions.getTablesList(e.target.value, () => { }))
      }),
      classes: "col-span-1"
    }, {
      label: "New Title",
      value: "",
      type: "text",
      name: "formtvalue",
      classes: "col-span-1"
    }
  ]




  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    // console.log(data)
    // dispatch(AuthActions.signIn(data, () => {
    //     navigate('/authenticate')
    // }))

  }


  const onTableViewSubmit = (data) => {
    console.log(data, "datadata onTableViewSubmit")


    dataValue

    data["dataValue"] = dataValue



    dispatch(CustomQueryActions.postSqlQueryCreator(true, data))

    // dispatch(AuthActions.signIn(data, () => {
    //     navigate('/authenticate')
    // }))

  }

  const onTableViewGenerateSubmit = (data) => {

    console.log(data, "dsadasdsadsadsadas")
    data["dataValue"] = dataValue

    dispatch(CustomQueryActions.postSqlQueryCreator(true, data, () => {


      // alert("hello")

      let dataing={
        "queries":"",
        "dbServer":"dbServer"
      }

      dataing["queries"] = sqlQuerData?.sqlQuery?.msg
      dataing["dbServer"] = data["ServerSelection"]
      // dataing["dbServer"] = data.queries.replace("endingdate", `'${data.endDate.replace("T", " ")}'`)


      console.log(dataing,"dsadasdsadsadsadas")

      // console.log(dsadasdsadsadsadas)

      // setValue("queries", state?.queries)
      // setValue("dbServer", state?.dbServer)

      // console.log(data, "datadata")


      navigate("/custom-query/run-query", {
        state: dataing
      })
    }))
  }



  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList, selectedItem, "datadata")
    // dispatch(AuthActions.signIn(data, () => {
    //     navigate('/authenticate')
    // }))

  }


  const onRemove = (selectedList, removedItem) => {
    console.log(selectedList, removedItem, "datadata")
    // dispatch(AuthActions.signIn(data, () => {
    //     navigate('/authenticate')
    // }))

  }








  console.log(Form, "Form 11")


  useEffect(() => {
    dispatch(CustomQueryActions.getDatabaseList())
  }, [])
  return <>
    <div className='w-full flex justify-center'>
      <div className="w-96 bg-center">
      </div>
    </div>

    <div class="grid h-auto grid-cols-12 gap-2 m-2 bg-white">
      <div className='col-span-6'>
        <CommonForm classes={"grid-cols-2 gap-1"} errors={errors} Form={Form} register={register} setValue={setValue} getValues={getValues} />
      </div>
    </div>
    <div className='w-full mt-3 bg-white'>
      <div class="grid grid-cols-12 gap-2 m-2 bg-white">
        <div className='col-span-3 border-primaryLine p-1 border-t-4 border'>
          <CommonForm classes={"grid-cols-1 gap-1 static"} errors={errors} Form={searchForm} register={register} setValue={setValue} getValues={getValues} />
          <div className='h-96 overflow-y-scroll'>
            {
              upmanagingFilter?.map((itm) => {
                return <QueryItem filtering={filtering} SetgOpen={SetgOpen} gopen={gopen} setDataValue={setDataValue} dataValue={dataValue} itm={itm} value={20} size={0} />
              })

            }
          </div>
        </div>

        <div className='col-span-9'>
          {/* <div class="grid h-52 grid-cols-1 gap-2 bg-white">

            <div className='h-52 col-span-1 p-2 border-blue-800 border-t-8 border pt-0'>
              <div className='flex justify-between p-2 pt-0 '>

                <h1>
                  Columns
                </h1>
                <button onClick={() => {
                  setcountformtwo((prev) => {
                    return [...prev, ""]
                  })
                }} className='p-2 bg-orange-500 text-white rounded-full'>
                  <Unicons.UilPlus size="24" />
                </button>
              </div>
              <div className='h-full overflow-x-scroll'>
                <div className='flex flex-col justify-between p-2 '>
                  {countformtwo.map((val, index) => {
                    return <CommonForm classes={"grid-cols-3 gap-1 w-full"} errors={errors} Form={multiFormtwo.map((itm) => { return { ...itm, name: itm.name + index + "form1" } })} register={register} setValue={setValue} getValues={getValues} />
                  })}


                  <button onClick={(handleSubmit(onTableViewSubmit))} className='mt-6 w-full justify-center rounded-md bg-primaryLine px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button>


                </div>
              </div>

            </div>
          </div> */}
          <div class="grid h-96 grid-cols-1 gap-2 bg-white">
            {/* <div className='col-span-1 h-40 pt-0 overflow-scroll relative border-primaryLine border-t-8 border'>
              <div className='flex w-full top z-50 justify-between bg-primaryLine sticky p-2 pt-0'>

                <h1 className='text-white'>

                  Order
                </h1>
                <button onClick={() => {
                  let finval = 0
                  setcountformtwo((prev) => {
                    let val = [...prev]
                    let sval=val.pop()
                    if(isNaN(sval)){
                      finval = 1
                    }else{
                      finval = sval + 1
                    }
                    console.log(finval, "finval", val, prev)
                    return [...prev, finval]
                  })
                  setonestfilter(newprev => ({
                    ...newprev,
                    ["ordercondition" + "_" + finval + "_form"]: "blank"
                  }));
                }}
                  className='bg-orange-500 text-white rounded-full'>
                  <Unicons.UilPlus size="24" />
                </button>
              </div>
              <div className='flex flex-col justify-between p-2'>
                <div class="overflow-scroll">
                  {countformtwo.map((val, index) => {
                    return <CommonForm classes={"grid-cols-4 gap-1 w-full"} errors={errors} Form={ordermultiForm.map((itm) => {
                      return {
                        ...itm,
                        type: itm.label == "Value" ? onestfilter["ordercondition" + "_" + val + "_form"] == "joins" ? "muitiSelect" : "hideen" : itm.type,
                        props: itm.label == "Select Column" || (itm.label == "Value" && onestfilter["ordercondition" + "_" + val + "_form"] == "joins") ? {
                          ...itm.props, onSelect: (a, b) => {
                            console.log("gamecall", a, b, "column" + "_" + val + "_form")
                            setValue(itm.label == "Select Column" ? "ordercolumn" + "_" + val + "_form" : "ordercvalue" + "_" + val + "_form", b.category + "smartGame" + b.name)
                          }
                        } : { ...itm.props },
                        option: itm.label == "Expression" ? all_command_type_wise[onestfilter["ordercondition" + "_" + val + "_form"]] : itm.option,
                        name: itm.name + "_" + val + "_form"
                      }
                    })}
                      register={register} setValue={setValue} getValues={getValues} />
                  })}
                </div>
              </div>

            </div> */}

            <div className='col-span-1 h-full  pt-0 overflow-scroll relative border-primaryLine border-t-8 border'>
              <div className='flex w-full top z-50 justify-between bg-primaryLine sticky p-2 pt-0'>

                <h1 className='text-white'>

                  Conditions
                </h1>
                <button onClick={() => {
                  let finval = 0
                  setconditioncountform((prev) => {
                    let val = [...prev]
                    let sval = val.pop()
                    if (isNaN(sval)) {
                      finval = 1
                    } else {
                      finval = sval + 1
                    }
                    console.log(finval, "finval", val, prev)
                    return [...prev, finval]
                  })
                  setnestfilter(newprev => ({
                    ...newprev,
                    ["wherecondition" + "_" + finval + "_form"]: "blank"
                  }));
                }}
                  className='bg-pbutton text-white rounded-full'>
                  <Unicons.UilPlus size="24" />
                </button>
              </div>
              <div className='flex flex-col justify-between p-2'>
                <div class="overflow-scroll">
                  {conditioncountform.map((val, index) => {
                    return <>
                      {index == 0 ? <></> : <CommonForm classes={"grid-cols-4 gap-1 w-full"} errors={errors} Form={conditionchildmultiForm.map((itm) => {
                        return {
                          ...itm,
                          name: itm.name + "_" + val + "_form"
                        }
                      })}
                        register={register} setValue={setValue} getValues={getValues} />}


                      <CommonForm classes={"grid-cols-4 gap-1 w-full"} errors={errors} Form={conditionmultiForm.map((itm) => {
                        return {
                          ...itm,
                          type: itm.name == "formovalue" ? nestfilter["wherecondition" + "_" + val + "_form"] == "joins" ? "muitiSelect" : "text" : itm.type,
                          props: itm.label == "Select Column" || (itm.label == "Value" && nestfilter["wherecondition" + "_" + val + "_form"] == "joins") ? {
                            ...itm.props, onSelect: (a, b) => {
                              console.log("gamecall", a, b, "column" + "_" + val + "_form")
                              setValue(itm.label == "Select Column" ? "wherecolumn" + "_" + val + "_form" : "formovalue" + "_" + val + "_form", b.category + "smartGame" + b.name)
                            }
                          } : { ...itm.props },
                          option: itm.label == "Expression" ? all_command_type_wise[nestfilter["wherecondition" + "_" + val + "_form"]] : itm.option,
                          name: itm.name + "_" + val + "_form"
                        }
                      })}
                        register={register} setValue={setValue} getValues={getValues} />


                    </>
                  })}
                  {conditioncountform.slice(0, conditioncountform.length - 1).map((val, index) => {
                    return
                  })}
                </div>
              </div>

            </div>
          </div>

          <div className='flex gap-8'>

            <button onClick={(handleSubmit(onTableViewSubmit))} className='mt-6 w-full justify-center rounded-md bg-primaryLine px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Generate Query</button>

            <button onClick={(handleSubmit(onTableViewGenerateSubmit))} className='mt-6 w-full justify-center rounded-md bg-primaryLine px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Generate & Run Query</button>


          </div>
        </div>
      </div>

      <div>

        <div className='grid h- grid-cols-12'>
          <div className='col-span-6'>
            <h1 className='m-2 mb-0 border-primaryLine border-t-4 border'>Output Query</h1>

            <div className={`m-2 mt-0 border-primaryLine overflow-scroll h-28 border-t-0 border`}><span className={`${sqlQuerData?.sqlQuery?.color}-500`}>{sqlQuerData?.sqlQuery?.msg || "---"}</span></div>
          </div>
          <div className='col-span-6'>
            <h1 className='m-2 mb-0 border-primaryLine border-t-4 border'>Output Table</h1>

            <div className='m-2 mt-0 border-primaryLine  border-t-0 border'>{dataQuery}</div>
          </div>
        </div>
      </div>



    </div>
  </>
};
export default AdvancedQueryBuilderComponent;
