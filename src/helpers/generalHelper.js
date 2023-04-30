// Update(Show/Hide) the gadgetbazaar loader
export const updateLoader = (show = false) => {
    const gadgetbazaar_loader = document.getElementById('gadgetbazaar_loader');
    if(gadgetbazaar_loader){
        if(show)
            gadgetbazaar_loader.style.display = 'block';
        else
            gadgetbazaar_loader.style.display = 'none';
    }
}
