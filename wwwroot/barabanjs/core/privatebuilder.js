function BuildElement(etype, eparent, id, eclass, ) {
    let instance = document.createElement(etype);
    if (eclass != null || eclass != undefined)
        instance.className = eclass;
    if (id != null || id != undefined)
        instance.id = id;
    if (eparent != null || eparent != undefined)
        document.getElementById(eparent).appendChild(instance);
    return instance;
}
function ParentSet(instance, eparent) {
    if (eparent != null || eparent != undefined)
        document.getElementById(eparent).appendChild(instance);
}
function IdSet(instance, id) {
    if (id != null || id != undefined)
        instance.id = id;
}
function CssSet(instance, eclass) {
    if (eclass != null || eclass != undefined)
        instance.className = eclass;
}
function AddText(instance, text) {
    if (text != null || text != undefined) {
        instance.appendChild(document.createTextNode(text));
    }
}
function AddAnchor(element, text, href) {
    let aTag = document.createElement('a');
    aTag.setAttribute('href', href);
    aTag.innerHTML = text;
    element.appendChild(aTag);
    return element;
}
function CreateAnchoredUL(names, hrefs, classname) {
    let tul = document.createElement("UL");
    tul.className = classname;
    for (i = 0; i < names.length; i++) {
        let tli = document.createElement("LI");
        let t = AddAnchor(tli, names[i], hrefs[i]);
        tul.appendChild(tli);
    }
    return tul;
}
function CreateUL(names, classname) {
    let tul = document.createElement("UL");
    tul.className = classname;
    for (i = 0; i < names.length; i++) {
        let tli = document.createElement("LI");
        let t = document.createTextNode(names[i]);
        tli.appendChild(t);
        tul.appendChild(tli);
    }
    return tul;
}
function AddClickFunction(element, func) {
    element.onclick = func;
}
function AddListner(element, func, params) {
    element.addEventListener('click', func.bind(null, params));
}

