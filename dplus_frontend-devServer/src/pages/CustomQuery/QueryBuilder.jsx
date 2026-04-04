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
import { all_command_type, all_command_type_wise, sql_data_generator } from '../../utils/queryBuilder';


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

const QueryBuilderComponent = () => {

  const dispatch = useDispatch()

  const [oneLoad, setOneLoad] = useState(false)
  const [nestfilter, setnestfilter] = useState({"condition_1_form":"blank"})
  const [gopen, SetgOpen] = useState([])
  const [dataQuery, SetdataQuery] = useState("Select * from values;")
  const [filtering, setFiltering] = useState("Select * from values;")
  const [managingFilter, setManagingFilter] = useState([])
  const [upmanagingFilter, setupManagingFilter] = useState([])
  const [countform, setcountform] = useState([1])
  const [countformtwo, setcountformtwo] = useState([""])

  // console.log(filtering, "filteringfiltering")
  const [dataValue, setDataValue] = useState([])
  useSelector((state) => {
    console.log(state, "state")
  })
  let databaseList = useSelector((state) => {
    return state?.customQuery?.databaseList
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
  let Form = [
    {
      label: "Select Server",
      value: "",
      option: databaseList,
      type: "select",
      name: "ServerSelection",
      required: false,
      props:{
        onChange: ((e) => {
          setOneLoad(true)
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
      value: "name",
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
  let multiForm = [
    {
      label: "Select Column",
      value: "",
      singleSelect: true,
      option: tableList?.d2,
      name: "condition",
      type: "muitiSelect",
      onChanging: ((e) => {

      }),
      props: {
        onSelect:(e,a,b,c) => {console.log({e,a,b,c})}
      },
      classes: "col-span-1  "
    },
    {
      label: "Condition",
      value: "",
      name: "condition",
      option: all_command_type,
      type: "select",
      required: true,
      props: {
        onChange: ((e) => {
          // console.log(e.target.name, "e geeter")
          let tar=e.target.name
          let val=e.target.value
          setnestfilter(prev => ({
            ...prev,
            [tar]:val
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
      name: "expression",
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
      name: "formovalue",
      singleSelect: true,
      option: tableList?.d2,
      classes: "col-span-1"
    }
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

    

    dispatch(CustomQueryActions.postSqlQueryCreator(true,sql_data_generator(data)))
    
    // dispatch(AuthActions.signIn(data, () => {
    //     navigate('/authenticate')
    // }))

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
      <div className='col-span-3'>
        <CommonForm classes={"grid-cols-1 gap-1"} errors={errors} Form={Form} register={register} setValue={setValue} getValues={getValues} />
      </div>
    </div>
    <div className='w-full mt-3 bg-white'>
      <div class="grid h-auto  grid-cols-12 gap-2 m-2 bg-white">
        <div className='col-span-3 overflow-x-auto border-primaryLine p-1 border-t-4 border'>
          <CommonForm classes={"grid-cols-1 gap-1"} errors={errors} Form={searchForm} register={register} setValue={setValue} getValues={getValues} />

          {
            upmanagingFilter?.map((itm) => {
              return <QueryItem filtering={filtering} SetgOpen={SetgOpen} gopen={gopen} setDataValue={setDataValue} dataValue={dataValue} itm={itm} value={20} size={0} />
            })

          }
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

            <div className='col-span-1 h-96 pt-0 overflow-scroll relative border-primaryLine border-t-8 border'>
              <div className='flex w-full top z-50 justify-between bg-primaryLine sticky p-2 pt-0'>

                <h1 className='text-white'>

                  Conditions
                </h1>
                <button onClick={() => {
                  let finval=0
                  setcountform((prev) => {
                    let val=[...prev]
                    finval=val.pop()+1
                    console.log(finval,"finval",val,prev)
                    return [...prev,finval]
                  })
                  setnestfilter(newprev => ({
                    ...newprev,
                    ["condition" + "_" + finval + "_form"]:"blank"
                  }));
                }}
                  className='bg-orange-500 text-white rounded-full'>
                  <Unicons.UilPlus size="24" />
                </button>
              </div>
              <div className='flex flex-col justify-between p-2'>
                {/* {console.log("multiForm gmae change", multiForm.map((itm) => { return { ...itm, option: itm.name == "Expression" ? all_command_type_wise[nestfilter[itm.name + "_" + "index" + "_form"]] : itm.option, name: itm.name + "_" + "index" + "_form" } }))} */}
                <div class="overflow-scroll">
                  {countform.map((val, index) => {
                    return <CommonForm classes={"grid-cols-4 gap-1 w-full"} errors={errors} Form={multiForm.map((itm) => {
                      // nestfilter[itm.name + "_" + index + "_form"]=""
                      // console.log(nestfilter,itm.name + "_" + val + "_form","nestfilternestfilter")
                      return {
                        ...itm,
                        type:itm.name=="formovalue"?nestfilter["condition" + "_" + val + "_form"]=="joins"?"muitiSelect" : "text":itm.type,
                        props:itm.label=="Select Column" || (itm.label=="Value" && nestfilter["condition" + "_" + val + "_form"]=="joins")? {...itm.props,onSelect:(a,b)=>{
                          console.log("gamecall",a,b,"column" + "_" + val + "_form")
                          setValue(itm.label=="Select Column" ? "column" + "_" + val + "_form" : "formovalue" + "_" + val + "_form",b.category+"smartGame"+b.name)
                        }}: {...itm.props},
                        option: itm.label == "Expression" ? all_command_type_wise[nestfilter["condition" + "_" + val + "_form"]] : itm.option,
                        name: itm.name + "_" + val + "_form"
                      }
                    })}
                      register={register} setValue={setValue} getValues={getValues} />
                  })}
                </div>
              </div>

            </div>
          </div>

          <div>

            <button onClick={(handleSubmit(onTableViewSubmit))} className='mt-6 w-full justify-center rounded-md bg-primaryLine px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton'>Submit</button>


          </div>
        </div>
      </div>

      <div>

        <div className='grid h- grid-cols-12'>
          <div className='col-span-3'>
            <h1 className='m-2 mb-0 border-primaryLine border-t-4 border'>Output Query</h1>

            <div className='m-2 mt-0 border-primaryLine border-t-0 border'>{dataQuery}</div>
          </div>
          <div className='col-span-9'>
            <h1 className='m-2 mb-0 border-primaryLine border-t-4 border'>Output Table</h1>

            <div className='m-2 mt-0 border-primaryLine  border-t-0 border'>{dataQuery}</div>
          </div>
        </div>
      </div>



    </div>
  </>
};
export default QueryBuilderComponent;
