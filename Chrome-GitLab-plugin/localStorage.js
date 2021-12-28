//localStorage操作
function getKey(key){
    let val = localStorage.getItem(key) || "";
    return val;
}

function setKey(key,val){
    localStorage.setItem(key,val);
    console.log('setKey',key,val);
}
