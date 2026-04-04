import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CCDash from '../../components/CCDash'
import cxixActions from '../../store/actions/cxix-actions'
import { useDispatch, useSelector } from 'react-redux'
import { baseassetUrl } from '../../utils/url'


const ScriptingPatternForm = () => {


    const { uid } = useParams()


    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [type, settype] = useState(true)

    let productData = [] 
    // useSelector((state) => {

    //     let cxix_scripting_list = state?.cxix?.cxix_scripting_list

    //     if (cxix_scripting_list.length > 0) {

    //         console.log(cxix_scripting_list.findIndex(itew => itew.uid == uid), "cxix_scripting_list")
    //         return cxix_scripting_list[cxix_scripting_list.findIndex(itew => itew.uid == uid)]["subList"]
    //     }
    //     else {
    //         return []
    //     }
    //     // return cxix_scripting_list.findIndex(itew => itew.uid == uid)
    // })




    // let productData=[
    //     {
    //         "name":"Nokia",
    //         "":"all",
    //         "companyimg":"/nokia.svg",
    //         "color":"bg-sky-100"
    //     },
    //     {
    //         "name":"Samsung",
    //         "":"all",
    //         "companyimg":"/samsung.png",
    //         "color":"bg-blue-100"
    //     },
    //     {
    //         "name":"Ericsson",
    //         "":"all",
    //         "companyimg":"/ericsson.png",
    //         "color":"bg-sky-200"
    //     },
    //     {
    //         "name":"Huawei",
    //         "":"all",
    //         "companyimg":"/huawei.png",
    //         "color":"bg-red-100"
    //     },
    //     {
    //         "name":"ZTE",
    //         "":"all",
    //         "companyimg":"/zte.png",
    //         "color":"bg-cyan-100"
    //     }
    // ]


    console.log(productData, "cxix_scripting_list")

    useEffect(() => {
        dispatch(cxixActions.get_cxix_scripting_data_list(uid))

    }, [])


    return <>


        <CCDash approveddata={
            productData?.map((itm => {
                return <>
                    <div
                        className={`${itm.color} ' shadow-md hover:shadow-rxl w-full flex h-24 cursor-pointer'`}
                        onClick={() => {
                            navigate(`/getToolForm/${itm["uid"]}`)
                        }}
                    >
                        {itm["companyimg"] && itm["companyimg"] != "" && <><img className='m-auto h-6' src={baseassetUrl + itm["companyimg"]} /></>}
                        <div className='m-auto '>{itm["name"]}</div>
                    </div>
                </>
            }))
        } settype={settype} label='' />
    </>
}

export default ScriptingPatternForm


