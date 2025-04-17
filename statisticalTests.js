 // Prueba de los Promedios
 const averagesTest = (numbers, alpha) => {
    const n = numbers.length; //tamano de la muestra
    const numbersAverage = numbers.reduce((sum, num) => sum + num, 0) / n; //calcula el promedio de los numeros
    
    // Valor esperado para una distribución uniforme (0,1) es 0.5
    const expectedAverage = 0.5;
    
    // Varianza teórica para una distribución uniforme (0,1) es 1/12
    const variance = 1/12;
    
    // Error estándar de la media
    const stdError = Math.sqrt(variance / n);
    
    // Estadístico Z, que mide cuán lejos está tu promedio del esperado (0.5), en función del error estándar.
    const z = (numbersAverage - expectedAverage) / stdError;
    
    // Valor crítico Z (dos colas)
    let criticalValue;
    if (alpha === 0.01) criticalValue = 2.576;
    else if (alpha === 0.05) criticalValue = 1.96;
    else criticalValue = 1.645; // alpha = 0.10
    
    const passed = Math.abs(z) <= criticalValue;
    
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
    const k = Math.floor(Math.sqrt(n)); // número de intervalos (regla de Sturges simplificada)
    
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
        chiSquared += Math.pow(observed[i] - expectedFrecuency, 2) / expectedFrecuency;
    }
    
    // Grados de libertad
    const df = k - 1;
    
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
    
    const passed = chiSquared <= criticalValue;
    
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