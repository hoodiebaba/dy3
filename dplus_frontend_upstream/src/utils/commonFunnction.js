
export function moreinfo(text, len) {
    let resultString = "";
    for (let i = 0; i <= len; i++) {
        resultString += text[i];
    }
    return resultString;
}


export function objectToQueryString(obj) {
    const queryString = Object.keys(obj)
        .filter(key => obj[key] !== "" && obj[key] !== "select")
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
    return queryString;
}

export function objectToArray(obj) {
    const queryString = Object.keys(obj)
        .filter(key => obj[key] !== "" && obj[key] !== "select")
        .map(key => encodeURIComponent(obj[key]));
    return queryString;
}




