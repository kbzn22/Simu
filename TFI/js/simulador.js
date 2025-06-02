var arrayLinea=[]; 
var arrayBarra=[];
var arrayTorta=[];
var dataCard=[];

let temperaturaMeses = [[23.9, 6.2], [26.2, 6], [27.2, 6.1], [26.7, 5.7], [24.9, 5.6], [21.8, 5.5]];
let humedadMeses     = [[65, 8], [65, 7], [64, 6], [66, 7], [69, 5], [72, 4]];


let madurosHembra = [];
let madurosMacho = [];
let huevos = [];

const iniciar =()=>{
    var nroF= document.getElementById("numberF").value;
    var metodo= document.getElementById("typeF").value;
    simular(nroF,metodo);
    actualizar(); 
}

const llenarArrays = () => {
  for (let i = 0; i <= 66; i++) madurosHembra[i] = 0;
  for (let i = 0; i <= 42; i++) madurosMacho[i] = 0;
  for (let i = 0; i <= 31; i++) huevos[i] = 0;
}

const machoOHembra = (PT) => {
  let u;
  let PM_PH = [0,0]

  for (let i = 0; i < PT; i++) {
    u = mixedCongruentialMethod((rand()*1000),1)[0];
    if(u<=0.5){
      PM_PH[0]++;
    } else {
      PM_PH[1]++;
    }
    
  }

  return PM_PH;
}

const simular =(nroF,metodo)=>{

    // aca va toda la logica y hay que actualizar los array globales con los resultados

  let EE;
  let u;
  let PM_PH = [];

  llenarArrays();

  let picudosIniciales = 100;

  if(metodo==='TMP'){
    u = mixedCongruentialMethod((rand()*1000),1)[0];
    EE = 0.4 + 0.2*u;
  } else {
    if(metodo==='DR'){
      u = mixedCongruentialMethod((rand()*1000),1)[0];
      EE = 0.6 + 0.2*u;
    } else {
      EE = 1;
    }
  }

  picudosIniciales = picudosIniciales*EE; //EE: porcentaje de los picudos extinto

  PM_PH = machoOHembra(picudosIniciales);

  let m = 1;
  let TPM;
  let HPM;

  while(m<=6){
    TPM = normal(temperaturaMeses[m-1][0],temperaturaMeses[m-1][1]);
    HPM = normal(humedadMeses[m-1][0],humedadMeses[m-1][1]);

    let PAM = 0;
    let d = 1;

    m++;
  }

  /*
    arrayLinea=[3455, 4566, 6251, 7841, 9821, 16000]; 
    arrayBarra=[100000,5000,3,4,5,6];
    arrayTorta=[65,35];
    dataCard=[76,79,90]
  */
}

const actualizar=()=>{
    
    renderLinea();
    renderBarra();
    renderTorta();
    setCard();
    
}

const setCard=()=>{

    document.getElementById("informe").innerHTML = `
  <h5>Resumen de la simulación</h5>
  <ul>
    <li>Ganancia total: $${dataCard[0]}</li>
    <li>Promedio por cliente: $${dataCard[1]}</li>
  </ul>
`;

}