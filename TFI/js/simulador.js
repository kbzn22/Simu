
var arrayBarra=[];
var arrayTorta=[];
var dataCard=[]; // data de la card informe general
var dataMensual=[]; //KBZA, en data te puse objetos con la info que tenes que mostrar de cada mes, del indice 0 a 5
var pam=[]; //este array de 0 a 5 es para el 1er grafico de barras

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
    u = rand();

    if(u<=0.5){
      PM_PH[0]++;
    } else {
      PM_PH[1]++;
    }
    
  }

  return PM_PH;
}

const supervivencia = (probDeSupervivencia, NH) => {
  let i = 1;
  let HS = 0;

  while(i<=NH){
    u = rand();
    
    if(u<=probDeSupervivencia){
      HS++;
    }

    i++;
  }

  return HS;
}

const actualizarArray = (n, array) => {
  while(n>=1){
    array[n-1] = array[n];
    n--;
  }
  array[n] = 0;
}

const picudosVivosHembra = () => {
  let H = 0;
  let i = 66;
  while(i>=1){
    H += madurosHembra[i];
    i--;
  }

  return H;
}

const picudosVivosTotales = () => {
  let PATC = 0;
  let i = 66;

  while(i>=1){
    PATC += madurosHembra[i];
    i--;
  }

  i = 42;

  while(i>=1){
    PATC += madurosMacho[i];
    i--;
  }

  return PATC;
}

const simular =(nroF,metodo)=>{

  // aca va toda la logica y hay que actualizar los array globales con los resultados

  let EE;
  let u;
  let PM_PH = [];
  data = [];
  pam = [];

  llenarArrays();

  let picudosIniciales = 100;

  if(metodo==='TMP'){
    u = rand();
    EE = 0.4 + 0.2*u;
  } else {

    if(metodo==='DR'){
      u = rand();
      EE = 0.6 + 0.2*u;
    } else {
      EE = 1;
    }
  }

  picudosIniciales = picudosIniciales*EE; //EE: porcentaje de los picudos extinto

  PM_PH = machoOHembra(picudosIniciales);
  PH = PM_PH[1]

  const nombresMeses = ['Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril'];
  let m = 1;

  while(m<=6){
    let TPM = normal(temperaturaMeses[m-1][0],temperaturaMeses[m-1][1]);
    let HPM = normal(humedadMeses[m-1][0],humedadMeses[m-1][1]);

    let PAM = 0;
    let d = 1;

    while(d<=30){
      let NH, HS;

      if(HPM<=60){
        NH = 5*PH;
        HS = supervivencia(0.05, NH); //HS = huevos sobrevivientes
      } else {

        if(HPM<=70){
          NH = 6*PH;
          HS = supervivencia(0.2, NH);
        } else {
          NH = 7*PH;
          HS = supervivencia(0.2, NH); 
        }
      }

      if(TPM<=20){
        huevos[31] = HS; //los huevos se guardan en la posicion 'n', tal que 'n' es el tiempo que les queda para madurar
      } else {

        if(TPM<=25){
          huevos[18]+=HS;
        } else {
          
          if(TPM<=30){
            huevos[10]+=HS;
          } else {
            huevos[9]+=HS;
          }
        }
      }

      PM_PH = machoOHembra(huevos[0]); //nacimiento de picudos, asignacion de sexo

      madurosMacho[42] = PM_PH[0];
      madurosHembra[66] = PM_PH[1];
      let madurosHoy = huevos[0];
      let muertosHoy = madurosMacho[0] + madurosHembra[0];
      PAM += madurosHoy - muertosHoy;

      actualizarArray(42, madurosMacho);
      actualizarArray(66, madurosHembra);
      actualizarArray(31, huevos);

      PH = picudosVivosHembra();

      d++;
    }

    pam[m-1] = PAM; //picudos adultos del mes
    
    dataMensual[m-1] = {
      'mes': nombresMeses[m-1],
      'temperaturaPromedioMes': TPM,
      'humedadPromedioMes': HPM,
      'picudosAdultosReproductivos': PAM //
    }

    m++;
  }

  const PATC = picudosVivosTotales();

  if(nroF===0){

  } else {
    if(nroF<=2){
      u = rand();
      efectividad = 0.6 + 0.1*u;
    } else {
      if(nroF<=4){
        u = rand();
        efectividad = 0.8 + 0.1*u;
      } else {
        u = rand();
        efectividad = 0.9 + 0.05*u;
      }
    }
  }

  const costoFumigacion = nroF * 20;

  let PATCS= 0;

  for (let i = 0; i < PATC; i++) {
    u = rand();
    if(u>efectividad){
      PATCS++;
    }
  }

  let AT = 0;

  for (let i = 0; i < 300; i++) { 
    /*por cada hectarea se simula la cantidad de plantas,
    y por cada planta se simula el algodon que produce*/
    
    u = rand();
    let algodon = Math.floor(60000 + 60000*u) + 1;
    let algodonProducidoPlanta;

    for (let i = 0; i < algodon; i++) {
      algodonProducidoPlanta = normal(0.018, 0.004);
      AT+=algodonProducidoPlanta
    }
    
  }
  
  /*
    arrayLinea=[3455, 4566, 6251, 7841, 9821, 16000]; 
    arrayBarra=[100000,5000,3,4,5,6];
    arrayTorta=[65,35];
    dataCard=[76,79,90]
    dataNoviembre=[];
    dataDiciembre=[];
    dataEnero=[];
    dataFebrero=[];
    dataMarzo=[];
    dataAbril=[];
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
  const setCardMensual = (mes) => {
    var dataCardM = dataMensual[mes];
    if (!dataCardM) return;

    document.getElementById("informeMensual").innerHTML = `
      <h5>Informe del mes de ${dataCardM.mes}:</h5>
      <ul>
        <li>Temperatura promedio: $${dataCardM.TPM}</li>
        <li>Humedad promedio $${dataCardM.HPM}</li>
        <li>Picudos adultos reproductivos $${dataCardM.PAM}</li>
      </ul>
    `;
  };

   document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const mes = item.getAttribute('data-mes');
      setCardMensual(mes);
    });
  })