import React, { useEffect, useState } from 'react';

import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

import * as portals from "react-reverse-portal";
import { useSelector } from 'react-redux';

const PowerBIDashboard = ({ setLoad, load, reportId, src }) => {

    const portalNode = React.useMemo(() => portals.createHtmlPortalNode(), []);
    const [, setReport] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    const [sampleReportConfig, setReportConfig] = useState({
        type: "report",
        embedUrl: "",
        id: "",
        accessToken: ""
    });


    useSelector((state) => {
        console.log(state, "statestatestate")
        return state?.customQuery?.databaseList
    })

    useSelector((state) => {
        if(load && state?.powerBI?.powerBiReportConf && state?.powerBI?.powerBiReportConf?.accessToken){
            setReportConfig(state?.powerBI?.powerBiReportConf)
            setLoad(false)
        }
        
    })


    console.log(sampleReportConfig, "sampleReportConfig")

    // Map of event handlers to be applied to the embedding report
    const eventHandlersMap = new Map([
        [
            "loaded",
            function () {
                console.log("Report has loaded");
            }
        ],
        [
            "rendered",
            function () {
                console.log("Report has rendered");

                // Update display message
                // setMessage("The report is rendered");
            }
        ],
        [
            "error",
            function (event) {
                if (event) {
                    console.error(event.detail);
                }
            }
        ]
    ]);

    const mockSignIn = async () => {
        setReportConfig({
            ...sampleReportConfig,
            embedUrl: "https://app.powerbi.com/reportEmbed?reportId=0a37d9e6-571d-421b-98ac-0b37945c8037&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
            accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvOGQyZDliODEtZDBlYy00OWY0LTk0NjYtNzMyZDZlNDI4MzFjLyIsImlhdCI6MTcwMjQ5OTExNCwibmJmIjoxNzAyNDk5MTE0LCJleHAiOjE3MDI1MDQ3OTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VkFBQUFONjFIanNHL1B3VlhkL0hTSi9UTkdhblNrZjYvTEIxNWtpOW9YSTE3RlVvMW9HdW5JTFFndVl2bGVUQldKbi9OIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6ImQyZTczZjYzLWI0ZjItNDliZi1hMjQyLWI0ZGMyOTAyNjA1OSIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiRGVtbyIsImdpdmVuX25hbWUiOiJmb3VyYnJpY2tzIiwiaXBhZGRyIjoiMTAzLjY4LjI4LjIzNiIsIm5hbWUiOiJGb3VyYnJpY2tzIERlbW8iLCJvaWQiOiIyODVkNGQxNS0zYTJjLTQ5ZjItYTFhZC04ZjMxMGUyZjVmODUiLCJwdWlkIjoiMTAwMzIwMDMyMzYwOUI1MiIsInJoIjoiMC5BVWtBZ1pzdGplelE5RW1VWm5NdGJrS0RIQWtBQUFBQUFBQUF3QUFBQUFBQUFBQkpBRDQuIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgUmVwb3J0LlJlYWQuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic3ViIjoiamNtQTRhaVFOMXRDVzNScG5zakN0ZExBbVpNY1NHZFNVa3FkbUdNRS1zSSIsInRpZCI6IjhkMmQ5YjgxLWQwZWMtNDlmNC05NDY2LTczMmQ2ZTQyODMxYyIsInVuaXF1ZV9uYW1lIjoiZm91cmJyaWNrc0BkYXRheW9nLmNvbSIsInVwbiI6ImZvdXJicmlja3NAZGF0YXlvZy5jb20iLCJ1dGkiOiJpcVVMQUY4RjNFMlNPX3ZTT2VSY0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.pE7rr6jA-SyZtjk91N8dCP6TxGaiUIa-LArfEodOJAZQAPwexnUc0FduFQ0-7ZVW7rwENqxh7hDZXESQ1cDodIr7_f8g7gHWCtDYwuecv9_2SrTsC7RVm0os2EnEiMVOUyIVNtdFWLJvagN81DKZlYyvGW42xln9bu20ygl6DQ30zMnXUOIIKQv0tI_dYrjPZ36YiappqJKmcaz7cDxeFVnRZncwemfOmiFJ8moRb6EYRgj_bbyip1cgatqaAcNKjdbTC1__Bfa501VtDG--v1L2WI2-RMTx3dnBizUiuWHupPdRG6ub-BTgiJFOm5KxKJchc3K5igy9LeQEXdHhAg"
        });
    };


    const handleResize = () => {
        setWidth(window.innerWidth, "window.innerWidth");
        setHeight(window.innerHeight, "window.innerWidth");
    };

    // https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c
    useEffect(() => {

        // mockSignIn()
        // Set up event listener for the resize event
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [sampleReportConfig,reportId]);
    return (
        <div className='h-full'>


            {/* <button> */}
            {/* <TopComponent position={position} /> */}


            {/* <iframe title="CXO Dashboard" className='w-full h-full' src={src} frameborder="0" allowFullScreen="true"></iframe> */}
            {/* <iframe title="CXO Dashboard" className='w-full h-full' src="https://app.powerbi.com/reportEmbed?reportId=971a078b-5783-41e8-a676-fd154fe0e597&autoAuth=true&ctid=8d2d9b81-d0ec-49f4-9466-732d6e42831c" frameborder="0" allowFullScreen="true"></iframe> */}

            {/* <portals.InPortal node={portalNode}> */}
            {
                sampleReportConfig ?
                    <PowerBIEmbed
                        embedConfig={sampleReportConfig}
                        eventHandlers={eventHandlersMap}
                        cssClassName={"h-full report-style-class"}
                        getEmbeddedComponent={(embedObject) => {
                            setReport(embedObject);
                        }}
                    /> : <></>
            }
            {/* </portals.InPortal> */}


            <portals.OutPortal node={portalNode} />
            <div className="hr"></div>

        </div>
    );
};

export default PowerBIDashboard;