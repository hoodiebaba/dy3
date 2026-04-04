import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CCDash from '../../components/CCDash'
import nokiaPrePostActions from '../../store/actions/nokiaPrePost-actions'
import cxixActions from '../../store/actions/cxix-actions'
import { useDispatch, useSelector } from 'react-redux'
import { baseassetUrl } from '../../utils/url'
import CommonActions from '../../store/actions/common-actions'

const ParameterAudit = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [type,settype]=useState(true)


    let productData = useSelector((state)=>{
        return state?.cxix?.cxix_scripting_list
    })




    // let productData=[
    //     {
    //         "name":"AT&T",
    //         "companyimg":"/at&t.png",
    //         "color":"bg-blue-100"
    //     },
    //     {
    //         "name":"T-Mobile",
    //         "companyimg":"/T-Mobile-Logo.png",
    //         "color":"bg-pink-100"
    //     },
    //     {
    //         "name":"SafariComm",
    //         "companyimg":"/safaricomm.png",
    //         "color":"bg-green-100"
    //     }
    // ]


    useEffect(() => {
        dispatch(cxixActions.get_cxix_audit_list())
    }, [])


    return <>


        <CCDash approveddata={
            productData?.map((itm => {
                return <>
                    <div
                        className={`${itm.color} 'shadow-md hover:shadow-rxl w-full flex h-24 cursor-pointer'`}
                        onClick={() => {
                            navigate(`${"/cx-ix-support/AuditPattern/"+itm["uid"]}`)

                            dispatch(CommonActions.setLastName(true,itm["name"]))
                        }}
                        >
                        {itm["companyimg"] && itm["companyimg"] != "" && <><img className='m-auto h-[70%]' src={baseassetUrl+itm["companyimg"]} /></>}
                        <div className='m-auto '>{itm["name"]}</div>
                    </div>
                </>
            }))
        } settype={settype} label='' />
    </>
}

export default ParameterAudit


