const normal=(m,d)=>{
    var sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += rand();
    }
    return (sum - 6) * d + m;
};

let values = [];
let i = 0;
const MAX_VALUES = 30000000;

const rand = () => {
  if (i >= MAX_VALUES) {
    generarNums();
  }
  return values[i++];
};

const generarNums = () => {
  console.log("Se llamó a generarNums");
  while (true) {
    const seed = Math.floor(Math.random() * 2 ** 32);
    const generated = mixedCongruentialMethod(seed, MAX_VALUES);
    if (frequencyTest(generated, 0.95)) {
      values = generated;
      i = 0;
      break;
     
    }
  }
};
const mixedCongruentialMethod = (seed, count) => {
  const results = new Float64Array(count); 
  let current = seed >>> 0; 

  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;

  for (let i = 0; i < count; i++) {
    current = (a * current + c) >>> 0; 
    results[i] = current / m; 
  }

  return results;
};

const frequencyTest = (numbers, alpha) => {
  const n = numbers.length;
  const k = Math.floor(Math.sqrt(n));
  const intervalSize = 1 / k;
  const frequencies = new Uint32Array(k); 

  for (let i = 0; i < n; i++) {
    const index = Math.min((numbers[i] / intervalSize) | 0, k - 1);
    frequencies[index]++;
  }

  const expected = n / k;
  let chiSquared = 0;
  for (let i = 0; i < k; i++) {
    const diff = frequencies[i] - expected;
    chiSquared += (diff * diff) / expected;
  }

  const df = k - 1;
  let critical;

  if (alpha === 0.01) critical = df + 3 * Math.sqrt(2 * df);
  else if (alpha === 0.05) critical = df + 2 * Math.sqrt(2 * df);
  else critical = df + Math.sqrt(2 * df); 

  return chiSquared <= critical;
};