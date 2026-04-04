import React from 'react'

// changes here
const CstmButton = ({ children, child, onClick, classes = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`${classes} py-2 cursor-pointer flex justify-center`}
    >
      {children ?? child}
    </div>
  );
};

/* const CstmButton = ({ child , classes = "" }) => { 
  // classes=classes+ 
  return ( 
    <div className={classes+" py-2"}>
    {child} 
    </div> 
    ) 
  } */

export default CstmButton