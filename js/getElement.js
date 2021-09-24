const getElement = (selection) => {
    const element = document.querySelector(selection)
    if(element) return element;
    else{
        throw Error ('no such element selected');
    }
}

export default getElement;