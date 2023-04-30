window.onload = function(){
    if(document.getElementById("gadgetbazaar_loader")){
        document.getElementById("gadgetbazaar_loader").style.display = "none";
        if(document.querySelector('header') && document.querySelector('header').classList.contains("page-loading")){
            document.querySelector('header').classList.remove("page-loading");
        }
    }
    const header = document.querySelector('header');
    let nextElement = header.nextElementSibling;
    const marginTop = header.offsetHeight;
    console.log("inside custom.js")
    if(header){
        if (nextElement.tagName !== 'SCRIPT' && nextElement.tagName !== 'LINK' && nextElement.tagName !== 'META') {
            // create a new style rule with the same selector and property, but with a higher specificity
            const styleRule = `${header.tagName.toLowerCase()} + ${nextElement.tagName.toLowerCase()}.${nextElement.classList[0]} { margin-top: ${marginTop}px !important; }`;
            const styleEl = document.createElement('style');
            styleEl.type = 'text/css';
            styleEl.appendChild(document.createTextNode(styleRule));
            document.head.appendChild(styleEl);
        }else{
            nextElement = nextElement.nextElementSibling;
            // create a new style rule with the same selector and property, but with a higher specificity
            const styleRule = `${header.tagName.toLowerCase()} + ${nextElement.tagName.toLowerCase()}.${nextElement.classList[0]} { margin-top: ${marginTop}px !important; }`;
            const styleEl = document.createElement('style');
            styleEl.type = 'text/css';
            styleEl.appendChild(document.createTextNode(styleRule));
            document.head.appendChild(styleEl);
        }
    }
    setTimeout(() => {
        if(document.getElementById("gadgetbazaar_loader")){
            document.getElementById("gadgetbazaar_loader").style.display = "none";
            if(document.querySelector('header') && document.querySelector('header').classList.contains("page-loading")){
                document.querySelector('header').classList.remove("page-loading");
            }
        }
    }, 10000);
}

let loading = true;
