const openTab = (tabName) => {
    const tabs = document.getElementsByClassName('tab'); //busca los divs con clase 'tab'
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active'); //oculta todos los tabs
    }
    document.getElementById(tabName).classList.add('active'); //muestra el seleccionado
}

const generateNumbers = () =>{
    const method = document.getElementById("method").value;
    const seed = parseInt(document.getElementById("seed").value);
    const count = parseInt(document.getElementById("count").value);
    
    let results = [];
    
    switch (method) {
        case "middleSquare":
            results = middleSquareMethod(seed, count);
            break;
        case "lehmer":
            results = lehmerMethod(seed, count);
            break;
        case "mixedCongruential":
            results = mixedCongruentialMethod(seed, count);
            break;
        case "multiplicativeCongruential":
            results = multiplicativeCongruentialMethod(seed, count);
            break;
        case "additiveCongruential":
            results = additiveCongruentialMethod(seed, count);
            break;
        default:
            alert("Método no válido");
            return;
    }
    
    generatedNumbers = results.slice();
    displayResults(results);
}