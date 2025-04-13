// Método de la Parte Central del Cuadrado
const middleSquareMethod = (seed, count) => {
    let results = [];
    let current = seed; //se inicializa la primera 'n', que seria n0
    const digits = 3;
    
    for (let i = 0; i < count; i++) {
        const squared = current*current; //eleva al cuadrado el número actual
        const squaredStr = squared.toString(); //lo pasa a string
        
        if((squaredStr.length - digits)%2 !== 0){ //verifica si la diferencia es impar
            squared *= 10;
            squaredStr = squared.toString();
        }

        const start = Math.floor((squaredStr.length - digits) / 2); //calcular el índice de inicio para cortar los dígitos del medio
        const middleDigits = squaredStr.slice(start, start + digits); //corta los digitos del medio

        current = parseInt(middleDigits); //actualizar current, es decir el n
        const randomValue = current / Math.pow(10, digits); // lo pasamos a número entre 0 y 1

        results.push(randomValue); //suma el numero generado al string results

    }
    
    return results;
}

// Método de Lehmer
const lehmerMethod = (seed, count) => {
    let results = [];
    let current = seed; //se inicializa la primera 'n', que seria n0
    const t = 76;
    const k = t.toString().length;
    
    for (let i = 0; i < count; i++) {
        const product = current*t; //producto de ni por t
        const productStr = product.toString();

        const firstSlice = productStr.slice(0, k);
        const secondSlice = productStr.slice(k);
        
        const first = parseInt(firstSlice);
        const second = parseInt(secondSlice) || 0; // por si secondSlice es vacío

        current = Math.abs(second - first) //restarle los primeros k digitos del producto al resto de digitos del producto y actualizar current, es decir el n
        const digits = current.toString().length;
        const randomValue = current / Math.pow(10, digits); // lo pasamos a número entre 0 y 1

        results.push(randomValue); //suma el numero generado al string results

    }
    
    return results;
}