import React from 'react'

const Button = ({ onClick, name, classes = "", icon }) => {

    let data = [
        ["bg-", "bg-pbutton"],
        ["w-", "w-full"]
    ]

    let tkn=1
    let value=""

    data.map((itm)=>{
        if(classes.search(itm[0])==-1){
            value=value+" "+itm[1]
        }
    })

    classes=classes+value

    return (


        <button onClick={onClick} className={`${classes} flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primaryLine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg-pbutton`}>
            {name} {icon}
        </button>
    )
}

export default Button