import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const timestamp = label;
        const formattedTimestamp = new Date(timestamp).toLocaleString(); // Format the timestamp as desired
        return (
            <div className="custom-tooltip bg-white p-2">
                <p>{formattedTimestamp}</p>
                {payload.map((entry, index) => (
                    <p key={`value-${index}`} style={{ color: entry.color }}>{`${entry.name}: ${entry.value}`}</p>
                ))}
            </div>
        );
    }

    return null;
};

const LiningChart = ({ data = [], labels = [], heading = "hello" }) => {
    // data = [
    //     { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    //     { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    //     { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    //     { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    //     { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    // ];

    // data.sort((a, b) => a.starttime - b.starttime);
    console.log(data, "datadatadatadata")
    data = Array.isArray(data) ? data.slice() : [...data];
    // data.sort((a, b) => a.starttime - b.starttime);
    data.sort((a, b) => new Date(a.x) - new Date(b.x));
    console.log(data, "datadatadatadata")
    return <div class={"w-full h-[450px]"}>


        
        {/* width={StackedBarChart(chartStack, chartType)} */}
        {heading != "" && <div className='w-full bg-primaryLine text-white flex justify-center mb-2'><h1 className='text-xl p-2'>{heading}</h1></div>}
        <div class={"w-full h-[350px]"}>
            <ResponsiveContainer>
                <LineChart
                    width={"100%"}
                    height={350}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
                >
                    {/* <CartesianGrid /> */}
                    <XAxis 
                        dataKey="x" 
                        angle={-25} 
                        // interval={8}          // ⬅️ SHOW every 8th label
                        // height={70}           // ⬅️ VERY IMPORTANT
                        textAnchor="end" 
                        type="category" 
                        tickFormatter={(unixTime) => {
                            // unixTime?
                            // unixTime.slice(5) :""
                        console.log(unixTime,"unixTimeunixTimeunixTime")
                        // const date = new Date(unixTime);
                        // const formattedDate = date.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
                        return unixTime
                        // const date = new Date(unixTime);
                        // const hours = ("0" + date.getHours()).slice(-2); // Add leading zero if single digit
                        // const minutes = ("0" + date.getMinutes()).slice(-2); // Add leading zero if single digit
                        // const day = ("0" + date.getDate()).slice(-2); // Add leading zero if single digit
                        // const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if single digit (getMonth() returns zero-based index)

                        // return `${day}/${month} ${hours}:${minutes} `;
                    }} />
                    <YAxis  />
                    {/* <Tooltip /> */}

{/* ----------------------Changes--------------------------- */}
                    <Tooltip content={CustomTooltip} /> 
                    {/* <Legend className='pt-6'/> */}
                    {/* <Legend className='pt-6' verticalAlign="bottom" /> */}
                    {
                        labels.map((its) => {
                            // return <Line type="linear" dataKey={its.name} width={20} stroke={its.color} dot={false} />
                            return <Line type="linear" dataKey="y" stroke={labels[0]?.color || "#8884d8"} dot={false} />
                        })
                    }
                </LineChart>

            </ResponsiveContainer>
        </div>
    </div>

}

export default LiningChart;





