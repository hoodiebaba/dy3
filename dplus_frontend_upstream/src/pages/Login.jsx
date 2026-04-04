// import React, { useEffect } from 'react';
// import { useForm } from "react-hook-form"
// import AuthActions from '../store/actions/auth-actions';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import CommonForm from '../components/CommonForm';
// import Button from '../components/Button';



// const Login = () => {

//     const dispatch = useDispatch()
//     const navigate = useNavigate()


//     let checkauth;


//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         getValues,
//         formState: { errors },
//     } = useForm()

//     const onSubmit = (data) => {
//         // if(data.email=="test@mcpsinc.com" && data.password=="Test@1234"){
//         //     localStorage.setItem("auth",true)
//         //     navigate("/")
//         // }else{
//         //     alert("Invalid Credentials")
//         // }
//         // if(data.)
//         // 
//         dispatch(AuthActions.signIn(data, () => {
//             navigate('/home')
//         }))

//     }

//     useEffect(() => {
//         checkauth = localStorage.getItem("auth")

//         console.log(checkauth == "true", "checkauthcheckauthcheckafauth")
//         if (checkauth == "true") {
//             navigate('/')
//         }
//     }, [checkauth])


//     let Form = [
//         {
//             label: "Username",
//             value: "",
//             name: "username",
//             type: "text",
//             required: false,
//             props: {},
//             classes: "text-black flex flex-col w-full",
//             inputWrapper: "h-[40px] w-[100%] mx-auto",
//             lclasses: "text-white dark:text-white ",
//         },
//         {
//             label: "Password",
//             value: "",
//             name: "password",
//             type: "password",
//             required: false,
//             props: {},
//             classes: "text-black flex flex-col w-full",
//             inputWrapper: "h-[40px] w-[100%] mx-auto",
//             lclasses: "text-white dark:text-white ",
//         }
//     ]

//     return checkauth ? <></> : <><div className='h-screen w-screen bg-login' style={{ backgroundPosition: "50% 5%" }}>
//         <div className="flex flex-col h-[100%] justify-center px-6 py-12 lg:px-8">
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <img className="mx-auto h-20 w-auto" src="/logo.png" alt="Datayog" />
//                 <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
//             </div>

//             <div className="mt-10 mx-auto w-full max-w-lg">
//                 {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="" method="POST">
//                     <div>
//                         <div className="flex items-center justify-between">
//                             <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Username</label>
//                         </div>
//                         <div className="mt-2">
//                             <input id="username" name="username" type="text" autoComplete="username" {...register("username", { required: "This Field is required" })} className="p-2 block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
//                             <p className='text-xs text-red-700'>{errors?.username?.message}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex items-center justify-between">
//                             <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
//                         </div>
//                         <div className="mt-2">
//                             <input id="password" name="password" type="password" autoComplete="current-password" {...register("password", { required: "This Field is required" })} className="p-2 block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
//                             <p className='text-xs text-red-700'>{errors.password?.message}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <button type="submit" className="flex w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-bg-pbutton border-2 border-orange-500 hover:border-2 hover:animate-pulse hover:border-orange-500 buttonAnim">Sign in</button>
//                     </div>
//                 </form> */}


//                 <CommonForm
//                     classes={"grid grid-cols-1 gap-1 p-4 "}
//                     Form={Form}
//                     errors={errors}
//                     register={register}
//                     setValue={setValue}
//                     getValues={getValues}
//                 />


//                 <Button classes={"mt-2 w-[100px] mx-auto"} onClick={(handleSubmit(onSubmit))} name="Submit" />


//             </div>
//         </div>
//     </div>
//     </>

// };

// export default Login;

import React, { useEffect } from 'react';
import { useForm } from "react-hook-form"
import AuthActions from '../store/actions/auth-actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CommonForm from '../components/CommonForm';
import Button from '../components/Button';



const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    let checkauth;


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        // if(data.email=="test@mcpsinc.com" && data.password=="Test@1234"){
        //     localStorage.setItem("auth",true)
        //     navigate("/")
        // }else{
        //     alert("Invalid Credentials")
        // }
        // if(data.)
        // 
        dispatch(AuthActions.signIn(data, () => {
            navigate('/home')
        }))

    }

    useEffect(() => {
        checkauth = localStorage.getItem("auth")

        console.log(checkauth == "true", "checkauthcheckauthcheckafauth")
        if (checkauth == "true") {
            navigate('/')
        }
    }, [checkauth])


    let Form = [
        {
            label: "Username",
            value: "",
            name: "username",
            type: "text",
            required: false,
            props: {},
            classes: "text-black ",
            lclasses: "text-white dark:text-white "
        },
        {
            label: "Password",
            value: "",
            name: "password",
            type: "password",
            required: false,
            props: {},
            classes: "text-black ",
            lclasses: "text-white dark:text-white "
        }
    ]

    return checkauth ? <></> : <><div className='h-screen w-screen bg-login' style={{ backgroundPosition: "50% 5%" }}>
        <div className="flex flex-col h-[100%] justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-20 w-auto" src="/logo.png" alt="Datayog" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="" method="POST">
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">Username</label>
                        </div>
                        <div className="mt-2">
                            <input id="username" name="username" type="text" autoComplete="username" {...register("username", { required: "This Field is required" })} className="p-2 block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <p className='text-xs text-red-700'>{errors?.username?.message}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" autoComplete="current-password" {...register("password", { required: "This Field is required" })} className="p-2 block w-full rounded-md border-0 py-1.5 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            <p className='text-xs text-red-700'>{errors.password?.message}</p>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-pbutton px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-bg-pbutton border-2 border-orange-500 hover:border-2 hover:animate-pulse hover:border-orange-500 buttonAnim">Sign in</button>
                    </div>
                </form> */}


                <CommonForm
                    classes={"grid-cols-1 gap-1 p-4 "}
                    Form={Form}
                    errors={errors}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                />


                <Button classes={"mt-2 w-[100px] mx-auto"} onClick={(handleSubmit(onSubmit))} name="Submit" />


            </div>
             <p className='absolute bottom-2 left-1/2 -translate-x-1/2 text-white'>Ver 0.1.18 Datetime 29-04-2024 16:06</p>
        </div>
    </div>
    </>

};

export default Login;
