
import Multiselect from 'multiselect-react-dropdown';
import React from 'react';


const Multiselection = ({ itm, errors, handleSubmit, setValue, getValues, register }) => {

    return <>
        <Multiselect
            menuIsOpen={true}
            keepSearchTerm={true}
            groupBy="category"
            hideSelectedList   ///for not showing tick elements in select bar   
            options={itm.option}
            showCheckbox
            singleSelect={itm.singleSelect ? itm.singleSelect : false}
            selectedValues={[]} // Preselected value to persist in dropdown
            onSelect={(e) => {
                
                let finalselection = e.map((itm)=>{return itm.id})
                setValue(itm.name,finalselection.join())
                console.log(e,"onselection")
            
            }} // Function will trigger on select event
            onRemove={(e) => {

                let finalselection = e.map((itm)=>{return itm.id})
                setValue(itm.name,finalselection.join())
                console.log(e,"onRemove")
            }} // Function will trigger on remove event
            {...itm.props}
            displayValue={itm.displayValue ? itm.displayValue : "name"}
            style={{
                searchBox: {
                    border: 'none',
                    'border-radius': '0px',
                    padding: "0px",
                    color: "black !important"
                },
                groupHeading: { 
                    color: "purple",
                    fontWeight: "bold",
                    
                  },
                  optionContainer: {  
                    // color: "red",
                    backgroundColor: "transparent"
                  }
            }}
            className='pt-1 text-black bg-white border-black border block h-8 w-full rounded-md py-1.5 p-2 text-white-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
        />
    </>
};

export default Multiselection;
