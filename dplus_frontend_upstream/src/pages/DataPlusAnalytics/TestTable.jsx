import React from 'react';
import AdvancedTable from '../../components/AdvancedTable';
import { useForm } from 'react-hook-form';

const TestTable = () => {

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()
    let table = {
        columns: [
            {
                name: "Head1",
                value: "Head1",
            },
            {
                name: "Head2",
                value: "Head2",
            },
            {
                name: "Head1",
                value: "Head1",
            },
            {
                name: "Head2",
                value: "Head2",
            }
        ],
        properties: {
            rpp: [10, 20, 50, 100]
        },
        filter: [
            {
                name: "Head1",
                type: "text",
                props:{
                    
                }
            }, {
                name: "Head1",
                type: "select",
                option: [
                    {
                        label: "a",
                        valuee: "a"
                    }
                ],
                props:{

                }
            }
        ]
    }
    let data = [
        {
            Head1: "Hello",
            Head2: "Hello"
        },
        {
            Head1: "Hello",
            Head2: "Hello"
        },
        {
            Head1: "Hello",
            Head2: "Hello"
        },
        {
            Head1: "Hello",
            Head2: "Hello"
        },
        {
            Head1: "Hello",
            Head2: "Hello"
        },
        {
            Head1: "Hello",
            Head2: "Hello"
        }
    ]
    return <>
        <AdvancedTable table={table} data={data} errors={errors} register={register} setValue={setValue} getValues={getValues}/>

        {/* </AdvancedTable> */}
    </>
};

export default TestTable;
