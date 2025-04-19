let generatedNumbers = [];

//pasar de un tab al otro
const openTab = (tabName, button) => {
    
    const tabs = document.getElementsByClassName('tab');
    const buttons = document.querySelectorAll('.tab-buttons button');

    // Ocultar todos los tabs
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    // Quitar clase 'active' de todos los botones
    buttons.forEach(btn => btn.classList.remove('active'));

    // Activar el tab correspondiente
    document.getElementById(tabName).classList.add('active');

    // Activar el botón correspondiente
    button.classList.add('active');
};


//generar numeros pseudo-aleatorios a partir de los input
const generateNumbers = () => {
    const method = document.getElementById("method").value;
    const seed = parseInt(document.getElementById("seed").value);
    const count = parseInt(document.getElementById("count").value);
    
    if(!verifySeed(seed)){
        return;
    }

    if(!verifyCount(count)){
        return;
    }

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
    displayGeneratedNumbers(results);
}

const verifySeed = (seed) => {
    if(seed < 0) {
        alert("La semilla debe ser positiva.")
        return false;
    }

    if(isNaN(seed)) {
        alert("Semilla invalida: debe ser un numero.")
        return false;
    }

    return true;
}

const verifyCount = (count) => {
    if(count >= 100) {
        alert("La cantidad de numeros debe ser menor que 100.");
        return false;
    }

    if(count <= 0) {
        alert("La cantidad de numeros debe ser mayor que 0.");
        return false;
    }

    if(isNaN(count)) {
        alert("Cantidad invalida: debe ser un numero.");
        return false;
    }

    return true;

}

//mostrar numeros pseudo-aleatorios generados en la tabla
const displayGeneratedNumbers = (results) => {
    const tbody = document.getElementById("resultsBody");
    tbody.innerHTML = "";
    
    results.forEach((value, index) => {
        const row = document.createElement("tr");
        
        const iterationCell = document.createElement("td");
        iterationCell.textContent = index + 1;
        
        const valueCell = document.createElement("td");
        valueCell.textContent = value.toFixed(4);
        
        row.appendChild(iterationCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
    });
}

//que el textarea del tab "Pruebas Estadisticas" contenga los numeros pseudo-aleatorios generados en el otro tab
const useGeneratedNumbers = () => {
    if (generatedNumbers.length === 0) {
        alert("No hay números generados para usar.");
        return;
    }
    
    const numbersStr = generatedNumbers.map(num => num.toFixed(4)).join(", ");
    document.getElementById("numbersInput").value = numbersStr;
}

//limpiar textarea del tab "Pruebas Estadisticas"
const clearNumbers = () => {
    document.getElementById("numbersInput").value = "";
}

//correr la prueba seleccionada sobre los numeros ingresados y el alpha seleccionado
const runTest = () => {
    const numbers = parseInputNumbers();
    if (!numbers) return; //retorna si hubo un error
    
    const testMethod = document.getElementById("testMethod").value;
    const alpha = parseFloat(document.getElementById("alpha").value);
    
    let result;
    
    switch (testMethod) {
        case "mean":
            result = averagesTest(numbers, alpha);
            break;
        case "frequency":
            result = frequencyTest(numbers, alpha);
            break;
        case "series":
            result = seriesTest(numbers, alpha);
            break;
        case "ks":
            result = kolmogorovSmirnovTest(numbers, alpha);
            break;
        case "runs":
            result = runsAboveBelowMeanTest(numbers, alpha);
            break;
        default:
            alert("Prueba no válida");
            return;
    }
    
    displayTestResult(result); //despliega en pantalla el resultado de las prueba
}

//validar y convertir numeros del textarea
const parseInputNumbers = () => {
    const textAreaInput = document.getElementById("numbersInput").value;

    if (!textAreaInput.trim()) { //verifica si el campo esta vacio o solo tiene espacios.
        alert("Por favor ingrese números para probar.");
        return null;
    }
    
    const numbersStr = textAreaInput.split(","); //se separa los números por coma:
    const numbers = [];
    
    for (let str of numbersStr) { //se recorre cada número como string, lo convierte a float y valida:
        const num = parseFloat(str.trim());
        if (isNaN(num)) {
            alert(`Valor inválido encontrado: "${str}"`);
            return null;
        }
        if (num < 0 || num > 1) {
            alert(`Los números deben estar entre 0 y 1. Valor inválido: ${num}`);
            return null;
        }
        numbers.push(num);
    }
    
    if (numbers.length < 5) { //verifica que haya almenos 5 numeros validos
        alert("Se necesitan al menos 5 números para realizar pruebas estadísticas.");
        return null;
    }
    
    return numbers;
}

//mostrar el resultado de la prueba seleccionada
function displayTestResult(result) {
    const testResultDiv = document.getElementById("testResult");
    testResultDiv.innerHTML = "";
    
    const title = document.createElement("h3");
    title.textContent = result.testName;
    testResultDiv.appendChild(title);
    
    if (result.error) {
        const errorP = document.createElement("p");
        errorP.style.color = "red";
        errorP.textContent = result.error;
        testResultDiv.appendChild(errorP);
        return;
    }
    
    const details = document.createElement("div");
    
    // Mostrar detalles específicos de cada prueba
    if (result.testName === "Prueba de los Promedios") {
        details.innerHTML = `
            <p>Número de muestras (n): ${result.n}</p>
            <p>Media observada: ${result.mean.toFixed(6)}</p>
            <p>Media esperada: ${result.expectedMean.toFixed(6)}</p>
            <p>Valor Z calculado: ${result.zValue.toFixed(6)}</p>
            <p>Valor crítico Z (α = ${result.alpha}): <span class="critical-value">±${result.criticalValue.toFixed(3)}</span></p>
        `;
    } else if (result.testName === "Prueba de la Frecuencia (Chi-cuadrado)") {
        details.innerHTML = `
            <p>Número de muestras (n): ${result.n}</p>
            <p>Número de intervalos (k): ${result.k}</p>
            <p>Chi-cuadrado calculado: ${result.chiSquared.toFixed(6)}</p>
            <p>Valor crítico (α = ${result.alpha}, df = ${result.k - 1}): <span class="critical-value">${result.criticalValue.toFixed(3)}</span></p>
        `;
    } else if (result.testName === "Prueba de la Serie") {
        details.innerHTML = `
            <p>Número de muestras (n): ${result.n}</p>
            <p>Número de intervalos (x): ${result.x}</p>
            <p>Chi-cuadrado calculado: ${result.chiSquared.toFixed(6)}</p>
            <p>Valor crítico (α = ${result.alpha}, df = ${result.x * result.x - 1}): <span class="critical-value">${result.criticalValue.toFixed(3)}</span></p>
        `;
    } else if (result.testName === "Prueba de Kolmogorov-Smirnov") {
        details.innerHTML = `
            <p>Número de muestras (n): ${result.n}</p>
            <p>D = ${result.D.toFixed(6)}</p>
            <p>Valor crítico (α = ${result.alpha}): <span class="critical-value">${result.criticalValue.toFixed(6)}</span></p>
        `;
    } else if (result.testName === "Prueba de Corridas Arriba/Abajo de la Media") {
        details.innerHTML = `
            <p>Número de muestras (n): ${result.n}</p>
            <p>Valor Z calculado: ${result.chiSquared.toFixed(6)}</p>
            <p>Valor crítico Z (α = ${result.alpha}): <span class="critical-value">±${result.criticalValue.toFixed(3)}</span></p>
        `;
    }
    
    testResultDiv.appendChild(details);
    
    const conclusion = document.createElement("div");
    conclusion.className = `conclusion ${result.passed ? 'passed' : 'failed'}`;
    conclusion.textContent = result.conclusion;
    testResultDiv.appendChild(conclusion);
}