import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import CommonForm from './CommonForm'
import MapActions from '../store/actions/map-actions'
import QueryItem from '../pages/CustomQuery/QueryItem';


const ComponentSidebar = ({ sidebarOpen, children }) => {

    
    return (

        <div className={`absolute bg-[#ffffff] h-[100%] w-[100%] right-0 ${sidebarOpen?"block":"hidden"}` }>
           
             {children}
             
        </div>
    );
};

export default ComponentSidebar;
