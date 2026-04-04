import React from 'react';

const Table = ({ headers, classes = "", columns, commonCols = false, tableOpen = true, tableClose = true }) => {

    console.log(headers, columns, commonCols, "headers, columns, commonCols")
    return  <> 
    <table border={1} className={'w-[100%] table-auto ' + classes}> 

        <thead>
            <tr>
                {
                    headers.map((itm) => {
                        return <th className={"text-sm border-2 border-black " + commonCols ? 'text-xs border-[1px] border-black border-gray-800 border-t-[0.5px]' : 'text-xs border-[1px] border-black border-gray-400 border-2'}>
                            {itm}
                        </th>
                    })
                }
            </tr>
        </thead>



        {
            commonCols ? <tbody> {columns.map((itm) => {
                return <tr className=' border-gray-800 border-t-[0.5px] text-xs last:border-b-0'>
                    {
                        itm
                    }
                </tr>


            })}
                {/* {
                        columns.map((itm) => {
                            return <tr>
                                {itm.map((innerItm) => {
                                    return <td className='border-gray-400 border-2 text-sm'>
                                        {innerItm}
                                    </td>
                                })}
                            </tr>

                        })
                    } */}
            </tbody> :
                <tbody>
                    {
                        columns.map((itm) => {
                            return <tr>
                                {itm.map((innerItm) => {
                                    return <td className='border-gray-400 border-2 text-sm'>
                                        {innerItm}
                                    </td>
                                })}
                            </tr>

                        })
                    }
                </tbody>
        }
        </table>

    </>
};

export default Table;
