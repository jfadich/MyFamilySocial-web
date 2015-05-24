

function get_recursive(obj, search, status) {
    if(status === undefined){
        status = get_recursive(obj, search, {found:false, value: null});
        return status.value;
    }

    if (obj){
        for (var key in obj) {
            if(status.found)
                return status;

            if(key == search){
                return {found:true, value: obj[key]};
            }
            else if (typeof obj[key] == "object")
                status = get_recursive(obj[key], search, status);

        }
    }

    return status;
}

