import React, { useEffect, useState } from 'react';
import PowerBIDashboard from '../components/PowerBIDashboard';
import { useDispatch } from 'react-redux';
import PowerBIActions from '../store/actions/powerBI-actions';

const CommonPowerBI = ({ reportId, src }) => {

    const dispatch = useDispatch()

    const [load, setLoad] = useState(true);
    const [repId, serRepId] = useState("");
    console.log("serRepId",repId,reportId,"serRepIdserRepIdserRepId")
    if(repId!=reportId){
        console.log("serRepId",repId,reportId,"serRepIdserRepIdserRepId")
        dispatch(PowerBIActions.postpowerBItokenCreator(true, { "reportId": reportId }))
        setLoad(true)
        serRepId(reportId)
    }


    console.log("PowerBIDashboard")
    return (
        <div className='h-full'>
            <PowerBIDashboard setLoad={setLoad} load={load} reportId={reportId} src={src} />
        </div>
    );
};

export default CommonPowerBI;