window.onload = function(){
    const header = document.querySelector('header');
    let nextElement = header.nextElementSibling;
    const marginTop = header.offsetHeight;
    if (nextElement.tagName !== 'SCRIPT' && nextElement.tagName !== 'LINK' && nextElement.tagName !== 'META') {
        nextElement.style.marginTop = header.offsetHeight + 'px';
    }else{
        nextElement = nextElement.nextElementSibling;
        nextElement.style.marginTop = `${marginTop}px`;
    }
    
}