function hola(){
 alert("hola")
}

const expo = (alpha) => {
    var rng= rand();
  return - (1 / alpha) * Math.log(rng);
};

const uniform = (a, b) => {
    var rng= rand();
    return a + (b - a) * rng;
};

const binomial = (px) => {
var rng= rand();
  const sortedPx = [...px].sort((a, b) => a - b); 

  for (let i = 0; i < sortedPx.length; i++) {
    if (rng <= sortedPx[i]) {
      return i;
    }
  }
  return sortedPx.length - 1;
};
const poisson=(a) =>{
    var L = Math.exp(-a);
    var k = 0;
    var p = 1;

    do {
        k++;
        p *= Math.random();
    } while (p > L);

    return k - 1;
}

const normal=(m,d)=>{
    var sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += rand();
    }
    return (sum - 6) * d + d; 
};


const rand = () => {
  while (true) {
    var rng = Math.random() * 100;
    var values = mixedCongruentialMethod(rng, 9);
    var isRandom = frequencyTest(values, 0.95);
    if (isRandom) {
      return values[0];
    }
  }
};

const mixedCongruentialMethod = (seed, count)=> {
    let results = [];
    let current = seed; //se inicializa la primera 'n', que seria n0

    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    for (let i = 0; i < count; i++) {
        current = (a * current + c) % m; //formula del congruencial mixto actualiza el valor de ni
        const randomValue = current / m; //normaliza el número para que quede entre 0 y 1 dividiendo por m.
        results.push(randomValue); //suma el numero generado al array results
    }
    
    return results;
}

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
   
    return chiSquared <= criticalValue
}