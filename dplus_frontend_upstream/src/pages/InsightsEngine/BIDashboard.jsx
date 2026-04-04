import React, { useEffect, useState } from 'react';
import PowerBIDashboard from '../../components/PowerBIDashboard';

const BIDashboard = () => {
    
    return (
        <div className='h-full'>
            <PowerBIDashboard src={"https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c"}/>
        </div>
    );
};

export default BIDashboard;