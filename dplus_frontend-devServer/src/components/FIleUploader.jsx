import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import CommonForm from './CommonForm';
import { useForm } from 'react-hook-form';
import Button from './Button';
import { useDispatch } from 'react-redux';
import nokiaPrePostActions from '../store/actions/nokiaPrePost-actions';

const FileUploader = ({ isOpen, setIsOpen,fileUploadUrl,onTableViewSubmit }) => {

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const dispatch = useDispatch()

    let Form = [
        {
            label: "Input File",
            value: "",
            name: "uploadedFile",
            type: "file",
            required: false,
            props: {},
            classes: "col-span-1 sm:col-span-1 flex justify-between items-center"
        }
    ]

    
    return <>
        <Modal size={"sm"} modalHead={"Upload Bulk File"} children={
            <>
                <CommonForm
                    classes={"grid-cols-1 gap-1 p-4 "}
                    Form={Form}
                    errors={errors}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                />

                <Button classes={"mt-2 w-[100px] mx-auto"} onClick={(handleSubmit(onTableViewSubmit))} name="Submit" />
            </>
        } isOpen={isOpen} setIsOpen={setIsOpen} />

    </>
}


export default FileUploader;