function AddClickFunction(element, func) {
    element.onclick = func;
}
function BuildElement(etype, eparent, id, eclass,) {
    let instance = document.createElement(etype);
    if (eclass != null || eclass != undefined)
        instance.className = eclass;
    if (id != null || id != undefined)
        instance.id = id;
    if (eparent != null || eparent != undefined)
        document.getElementById(eparent).appendChild(instance);
    return instance;
}