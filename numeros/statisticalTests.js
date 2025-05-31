// Prueba de los Promedios
const averagesTest = (numbers, alpha) => {
    const n = numbers.length;
    const numbersAverage = numbers.reduce((sum, num) => sum + num, 0) / n; //calcula el promedio de los numero
    // Valor esperado para una distribución uniforme (0,1) es 0.5
    const expectedAverage = 0.5
    // Varianza teórica para una distribución uniforme (0,1) es 1/12
    const variance = 1/12
    // Error estándar de la media
    const stdError = Math.sqrt(variance / n)

    //calcular estadístico Z
    const z = (numbersAverage - expectedAverage) / stdError
    
    // Valor crítico Z (dos colas)
    let criticalValue;
    if (alpha === 0.01) criticalValue = 2.576;
    else if (alpha === 0.05) criticalValue = 1.96;
    else criticalValue = 1.645; // alpha = 0.1

    //pasa la prueba?
    const passed = Math.abs(z) <= criticalValue

    return {
        testName: "Prueba de los Promedios",
        n: n,
        mean: numbersAverage,
        expectedMean: expectedAverage,
        zValue: z,
        criticalValue: criticalValue,
        alpha: alpha,
        passed: passed,
        conclusion: passed ? 
            "Los números pasan la prueba de promedios (no hay evidencia para rechazar la hipótesis de uniformidad)" :
            "Los números NO pasan la prueba de promedios (se rechaza la hipótesis de uniformidad)"
    };
}
        
// Prueba de la Frecuencia (Chi-cuadrado)
const frequencyTest = (numbers, alpha)=> {
    const n = numbers.length; //tamano de la muestra
    const k = Math.floor(Math.sqrt(n)); // número de intervalos (regla de Sturges simplificada
    const intervalSize = 1 / k; //se calcula el tamano de los intervalos

    const observedFrecuencies = new Array(k).fill(0); //Array de Frecuencias observadas, llenas con 0.

    for (const num of numbers) { //recorre todos los números generados.
        const index = Math.min(Math.floor(num / intervalSize), k - 1); //calcula en qué intervalo cae dividiendo el número por el tamaño del intervalo y usa Math.floor() para obtener el índice del intervalo.
        observedFrecuencies[index]++;
    }
    const expectedFrecuency = n / k; //se calcula la Frecuencia esperada

    // Calcular chi-cuadrado
    let chiSquared = 0;
    for (let i = 0; i < k; i++) {
        chiSquared += Math.pow(observedFrecuencies[i] - expectedFrecuency, 2) / expectedFrecuency;
    }
    // Grados de libertad
    const df = k - 1
    // Valores críticos aproximados para chi-cuadrado
    let criticalValue;
    if (alpha === 0.01) {
        if (df === 4) criticalValue = 13.28;
        else if (df === 5) criticalValue = 15.09;
        else if (df === 6) criticalValue = 16.81;
        else criticalValue = df + 3 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else if (alpha === 0.05) {
        if (df === 4) criticalValue = 9.49;
        else if (df === 5) criticalValue = 11.07;
        else if (df === 6) criticalValue = 12.59;
        else criticalValue = df + 2 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else { // alpha = 0.10
        if (df === 4) criticalValue = 7.78;
        else if (df === 5) criticalValue = 9.24;
        else if (df === 6) criticalValue = 10.64;
        else criticalValue = df + Math.sqrt(2 * df); // Aproximación para otros valores
    }
    
    //pasa la prueba?
    const passed = chiSquared <= criticalValue
    return {
        testName: "Prueba de la Frecuencia (Chi-cuadrado)",
        n: n,
        k: k,
        chiSquared: chiSquared,
        criticalValue: criticalValue,
        alpha: alpha,
        passed: passed,
        conclusion: passed ?
            "Los números pasan la prueba de frecuencia (no hay evidencia para rechazar la hipótesis de uniformidad)" :
            "Los números NO pasan la prueba de frecuencia (se rechaza la hipótesis de uniformidad)"
    };
}
        
// Prueba de la Serie
const seriesTest = (numbers, alpha)=> {
    const n = numbers.length;
    const x = Math.floor(Math.sqrt(n - 1)); //se busca un valor de x apropiado
    if (x < 2) {
        return {
            testName: "Prueba de la Serie",
            error: "No hay suficientes números para realizar la prueba de serie. Se necesitan al menos 4 pares de números."
        };
    }
    const expectedFrecuency = (n-1) / Math.pow(x, 2);

    // Crear matriz de frecuencias observadas de celdas x^2 
    const observedFrecuencies = Array.from({ length: x }, () => new Array(x).fill(0));
    // Armar los pares consecutivos y contar en que celda caen
    for (let i = 0; i < n - 1; i ++) {
        const num1 = numbers[i];
        const num2 = numbers[i + 1];
        const index1 = Math.min(Math.floor(num1 * x), x - 1); //obtiene el indice del intervalo de 0 a 1 en el que cae cada numero, el segundo valor es una proteccion en caso de que uno de los numeros sea justo 1.
        const index2 = Math.min(Math.floor(num2 * x), x - 1);
        observedFrecuencies[index1][index2]++;
    }
    // Calcular chi-cuadrado
    let chiSquared = 0;
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < x; j++) {
            chiSquared += Math.pow(observedFrecuencies[i][j] - expectedFrecuency, 2) / expectedFrecuency;
        }
    }

    // Grados de libertad
    const df = Math.pow(x, 2) - 1;
    // Valores críticos aproximados para chi-cuadrado
    let criticalValue;
    if (alpha === 0.01) {
        if (df === 3) criticalValue = 11.34;
        else if (df === 8) criticalValue = 20.09;
        else if (df === 15) criticalValue = 30.58;
        else criticalValue = df + 3 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else if (alpha === 0.05) {
        if (df === 3) criticalValue = 7.81;
        else if (df === 8) criticalValue = 15.51;
        else if (df === 15) criticalValue = 24.99;
        else criticalValue = df + 2 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else { // alpha = 0.10
        if (df === 3) criticalValue = 6.25;
        else if (df === 8) criticalValue = 13.36;
        else if (df === 15) criticalValue = 22.31;
        else criticalValue = df + Math.sqrt(2 * df); // Aproximación para otros valores
    }

    //pasa la prueba?
    const passed = chiSquared <= criticalValue;

    return {
        testName: "Prueba de la Serie",
        n: n,
        x: x,
        chiSquared: chiSquared,
        criticalValue: criticalValue,
        alpha: alpha,
        passed: passed,
        conclusion: passed ?
            "Los números pasan la prueba de serie (no hay evidencia de correlación serial)" :
            "Los números NO pasan la prueba de serie (hay evidencia de correlación serial)"
    };
}
    
// Prueba de Kolmogorov-Smirnov
const kolmogorovSmirnovTest = (numbers, alpha)=> {
    const n = numbers.length; //tamano de la muestra

    const sorted = [...numbers].sort((a, b) => a - b); //ordenar en forma ascendente la muestra
    const Fn = sorted.map((x, i) => (i + 1) / n); //calcular la Distribucion Acumulada Fn(x)
    const F = sorted.map(x => x); // F(x) = x en distribución uniforme

    const differences = Fn.map((fn, i) => Math.abs(fn - F[i])); //calcular las diferencias absolutas entre Fn y F

    const D = Math.max(...differences); //calcular la máxima diferencia D

    // Valores críticos para Kolmogorov-Smirnov
    let criticalValue;
    if (alpha === 0.01) {
        criticalValue = 1.63 / Math.sqrt(n);
    } else if (alpha === 0.05) {
        criticalValue = 1.36 / Math.sqrt(n);
    } else { // alpha = 0.10
        criticalValue = 1.22 / Math.sqrt(n);
    }

    //pasa la prueba?
    const passed = D <= criticalValue;

    return {
        testName: "Prueba de Kolmogorov-Smirnov",
        n: n,
        D: D,
        criticalValue: criticalValue,
        alpha: alpha,
        passed: passed,
        conclusion: passed ?
            "Los números pasan la prueba de Kolmogorov-Smirnov (no hay evidencia para rechazar la hipótesis de uniformidad)" :
            "Los números NO pasan la prueba de Kolmogorov-Smirnov (se rechaza la hipótesis de uniformidad)"
    };
}

// Prueba de Corridas Arriba/Abajo de la Media
const runsAboveBelowMeanTest = (numbers, alpha) => {
    const n = numbers.length;
    const average = 0.5; // Para distribución uniforme (0,1)
    //crear secuencia de 1 (≥ media) y 0 (< media)
    let sequence = numbers.map(num => num >= average ? 1 : 0);


    //calcular las frecuencias observadas Foi

    let observedFrequencies = [];
    let current = sequence[0];
    let length = 1;

    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] === current) {
            length++;
        } else {
            // Guardar la longitud de la corrida
            observedFrequencies[length - 1] = (observedFrequencies[length - 1] || 0) + 1;
            current = sequence[i];
            length = 1;
        }
    }

    observedFrequencies[length - 1] = (observedFrequencies[length - 1] || 0) + 1;  //registrar la última corrida


    //calcular las frecuencias esperadas Fei

    let expectedFrequencies = [];
    const k = observedFrequencies.length;

    for (let i = 0; i < k; i++) {
        expectedFrequencies[i] = (n - i + 4) / Math.pow(2, i + 3);
    }
    
    console.log("Observed:", observedFrequencies);
    console.log("Expected:", expectedFrequencies);
    //calcular chi-cuadrado
    let chiSquared = 0;
    for (let i = 0; i < k; i++) {
        if (observedFrequencies[i] && expectedFrequencies[i]) {
            chiSquared += Math.pow(observedFrequencies[i] - expectedFrequencies[i], 2) / expectedFrequencies[i];
        }
    }
    const df = k - 1; // grados de libertad

    // Valores críticos aproximados para chi-cuadrado
    let criticalValue;
    if (alpha === 0.01) {
        if (df === 3) criticalValue = 11.34;
        else if (df === 8) criticalValue = 20.09;
        else if (df === 15) criticalValue = 30.58;
        else criticalValue = df + 3 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else if (alpha === 0.05) {
        if (df === 3) criticalValue = 7.81;
        else if (df === 8) criticalValue = 15.51;
        else if (df === 15) criticalValue = 24.99;
        else criticalValue = df + 2 * Math.sqrt(2 * df); // Aproximación para otros valores
    } else { // alpha = 0.10
        if (df === 3) criticalValue = 6.25;
        else if (df === 8) criticalValue = 13.36;
        else if (df === 15) criticalValue = 22.31;
        else criticalValue = df + Math.sqrt(2 * df); // Aproximación para otros valores
    }

    //pasa la prueba?
    const passed = chiSquared <= criticalValue;

    return {
        testName: "Prueba de Corridas Arriba/Abajo de la Media",
        n: n,
        chiSquared: chiSquared,
        criticalValue: criticalValue,
        alpha: alpha,
        passed: passed,
        conclusion: passed ?
            "Los números pasan la prueba de corridas (no hay evidencia de patrones no aleatorios)" :
            "Los números NO pasan la prueba de corridas (hay evidencia de patrones no aleatorios)"
    };
}