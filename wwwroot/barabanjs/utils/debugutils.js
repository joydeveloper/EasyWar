function consolelog(valuename, value) {
    console.log(valuename, value);
}
function pagelog(parent, value) {
    let logval = document.createElement("h3");
    logval.innerHTML = value;
    document.getElementById(parent).appendChild(logval);
}
