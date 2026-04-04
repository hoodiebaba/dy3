import React, { useEffect, useState } from 'react';
import CommonForm from './CommonForm';
import Button from './Button';
import TableJson from './TableJson';
import { useSelector } from 'react-redux';

const SavedQueriesForm = ({ itm, Form, errors, register, setValue, getValues, handleSubmit, onTableView }) => {

    let runQuery = useSelector((state) => {
        console.log(state, "statestatestate")

        let interdata = state?.customQuery?.runQuery

        console.log(interdata, "interdatainterdata")
        return state?.customQuery?.runQuery
    })



    console.log(errors, "errorserrorserrorserrors")



    return <>
    
        {/* <CommonForm classes={"grid-cols-1 gap-2 p-4"} errors={errors} Form={Form.filter((formitm) => {
            if (itm.queries.includes(formitm.filtering)) {
                console.log(formitm, "formitmformitm")
                return formitm
            }
        })} register={register} setValue={setValue} getValues={getValues} />
        <div className='mx-3'>

            <Button classes={"mt-2 "} onClick={(e) => {
    handleSubmit(() => console.log("data_me "))
} catch (error) {

    console.log(error,"errorerrorerrorerror")
    
}
            }} name="Submit" />

        </div>
        <div className='w-full flex mt-3 justify-center'>
            {console.log(runQuery, "runQueryrunQuery")}
            {runQuery?.status ? runQuery?.status == 200 ?
                <TableJson headers={runQuery?.columns || []} columns={runQuery?.data || []} /> : <h1>{runQuery?.msg}</h1> : <></>
            }

        </div> */}
    </>
}

export default SavedQueriesForm