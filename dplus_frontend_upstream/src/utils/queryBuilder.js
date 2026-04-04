export let all_command_type = [
    {
        "label": "Select",
        "value": "blank"
    }, {
        "label": "Order",
        "value": "order"
    },
    {
        "label": "Join",
        "value": "joins"
    },
    {
        "label": "Aggregation Function",
        "value": "aggregationFunction"
    }
]

export let where_all_command_type = [
    {
        "label": "Select",
        "value": "blank"
    }, 
    {
        "label": "Where",
        "value": "where"
    }
]

export let all_command_type_wise = {


    "blank": [
        {
            "label": "Select",
            "value": "blank"
        }
    ],
    "order": [
        {
            "label": "Select",
            "value": "blank"
        },{
            "label": "Not sorted",
            "value": "Not sorted"
        },
        {
            "label": "Ascending",
            "value": "Ascending"
        },
        {
            "label": "Descending",
            "value": "Descending"
        }
    ],
    "where": [
        {
            "label": "Select",
            "value": "blank"
        },{
            "label": "starts with",
            "value": "starts with"
        },
        {
            "label": "contains",
            "value": "contains"
        },
        {
            "label": "is equal to",
            "value": "is equal to"
        },
        {
            "label": "is in list",
            "value": "is in list"
        },
        {
            "label": "does not start with",
            "value": "does not start with"
        },
        {
            "label": "does not contain",
            "value": "does not contain"
        },
        {
            "label": "is not equal to",
            "value": "is not equal to"
        },
        {
            "label": "is not in list",
            "value": "is not in list"
        },
        {
            "label": "is null",
            "value": "is null"
        },
        {
            "label": "is not null",
            "value": "is not null"
        },
        {
            "label": "greater than",
            "value": "greater than"
        },
        {
            "label": "less than",
            "value": "less than"
        },
        {
            "label": "greater than or equal to",
            "value": "greater than or equal to"
        },
        {
            "label": "less than or equal to",
            "value": "less than or equal to"
        }
    ],
    "joins": [
        {
            "label": "Select",
            "value": "blank"
        },{
            "label": "INNER JOIN",
            "value": "INNER JOIN"
        },
        {
            "label": "LEFT JOIN",
            "value": "LEFT JOIN"
        },
        {
            "label": "RIGHT JOIN",
            "value": "RIGHT JOIN"
        },
        {
            "label": "FULL JOIN",
            "value": "FULL JOIN"
        },
        {
            "label": "CROSS JOIN",
            "value": "CROSS JOIN"
        },
        {
            "label": "SELF JOIN",
            "value": "SELF JOIN"
        }
    ],
    "aggregationFunction":[
        {
            "label": "Select",
            "value": "blank"
        },{
            "label": "COUNT",
            "value": "COUNT"
        },
        {
            "label": "SUM",
            "value": "SUM"
        },
        {
            "label": "AVG",
            "value": "AVG"
        },
        {
            "label": "MIN",
            "value": "MIN"
        },
        {
            "label": "MAX",
            "value": "MAX"
        }
    ]
}

export function sql_data_generator(mainobj) {
    const groupedObj = Object.keys(mainobj).reduce((result, key) => {
        const match = key.match(/_(\d+)_form/);
        if (match) {
            const groupNumber = match[1];
            result[groupNumber] = result[groupNumber] || {};
            result[groupNumber][key] = mainobj[key];
        } else {
            result[key] = mainobj[key];
        }
        return result;
    }, []);

    // console.log(groupedObj);
    let ata = {}
    groupedObj.map((itm) => {

        console.log(Object.keys(itm).indexOf("condition_1_form"))
        let vel = Object.keys(itm).findIndex((itm) => itm.includes("condition"));

        if (ata[itm[Object.keys(itm)[0]]] == undefined) {

            console.log(Object.keys(itm))

            ata[itm[Object.keys(itm)[vel]]] = []
        }
        ata[itm[Object.keys(itm)[vel]]].push(itm)
    })

    return ata
}