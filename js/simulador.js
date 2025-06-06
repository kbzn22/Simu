var arrayBarra=[];
var arrayTorta=[];
var dataCard; // data de la card informe general
var dataMensual=[]; //KBZA, en data te puse objetos con la info que tenes que mostrar de cada mes, del indice 0 a 5
var pam=[]; //este array de 0 a 5 es para el 1er grafico de barras

let temperaturaMeses = [[23.9, 6.2], [26.2, 6], [27.2, 6.1], [26.7, 5.7], [24.9, 5.6], [21.8, 5.5]];
let humedadMeses = [[65, 8], [65, 7], [64, 6], [66, 7], [69, 5], [72, 4]];
const nombresMeses = ['Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril'];
let madurosHembra = [];
let madurosMacho = [];
let huevos = [];

const iniciar = async () => {
  document.getElementById("overlay").style.display = "flex";

  setTimeout(async () => {
    var nroF = document.getElementById("numberF").value;
    var metodo = document.getElementById("typeF").value;

    await simular(nroF, metodo);  
    actualizar();

    document.getElementById("overlay").style.display = "none";
  }, 100); // le das al navegador 100ms para renderizar el overlay
};

const setCard=()=>{
  document.getElementById("informe").innerHTML = `
  <h5>Resumen de la simulación</h5>
  <ul>
    <li>Picudos vivos totales: ${(dataCard.picudosVivosTotalesFinales)}</li>
    <li>Ingresos totales:  $${Math.round(dataCard.ingresosTotales)}</li>
    <li>Perdidas provocadas: $${Math.round(dataCard.danoProvocado)}</li>
    <li>Costos del metodo preventivo: $${Math.round(dataCard.costoMetodoPreventivo)}</li>
    <li>Costos de fumigacion: $${Math.round(dataCard.costoFumigacion)}</li>
    <li>Costo total: $${Math.round(dataCard.costoTotal)}</li>
    <li>Utilidad: $${Math.round(dataCard.beneficio)}</li>
  </ul>
  <h6>Conclusion: ${dataCard.rentabilidadMensaje}<h6>
`;
}
  const setCardMensual = (mes) => {
    var dataCardM = dataMensual[mes];
    if (!dataCardM) return;

    document.getElementById("informeMensual").innerHTML = `
      <h5>Informe del mes de ${dataCardM.mes}:</h5>
      <ul>
        <li>Temperatura promedio: ${Math.round(dataCardM.temperaturaPromedioMes)}°C</li>
        <li>Humedad promedio: ${Math.round(dataCardM.humedadPromedioMes)}%</li>
        <li>Picudos adultos reproductivos: ${Math.round(dataCardM.picudosAdultosReproductivos)}</li>
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
function actualizar(){
    renderLinea();
    renderBarra();
    renderTorta();
    setCard();
}


const llenarArrays = () => {
  madurosHembra = new Array(67).fill(0);
  madurosMacho = new Array(43).fill(0);
  huevos = new Array(32).fill(0);
  
}
  
const machoOHembra = (PT) => {
  let PM_PH = [0,0]

  for (let i = 0; i < PT; i++) {
   
    if(rand()<=0.5){
      PM_PH[0]++;
    } else {
      PM_PH[1]++;
    }
    
  }

  return PM_PH;
}
  
const supervivencia = (probDeSupervivencia, NH) => {
  let HS = 0;

  for (let i = 0; i < NH; i++) {
    if (rand() <= probDeSupervivencia) HS++;
  }

  return HS;
}
  
const actualizarArray = (n, array) => {
  array.copyWithin(0, 1, n+1);
  array[n] = 0;
}
  
const picudosVivosHembra = () => {
  let H = 0;
  let madurosH = madurosHembra;

  for (let i = 66; i >= 1; i--) {
    H += madurosH[i];
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

const perdidas = (picudosPorHectarea, AT) => {

  let perdidaEstimada;

  if (picudosPorHectarea <= 1000) {
    perdidaEstimada = 0.02;
  } else if (picudosPorHectarea <= 2000) {
    perdidaEstimada = 0.05;
  } else if (picudosPorHectarea <= 3000) {
    perdidaEstimada = 0.10;
  } else if (picudosPorHectarea <= 4000) {
    perdidaEstimada = 0.15;
  } else if (picudosPorHectarea <= 5000) {
    perdidaEstimada = 0.20;
  } else if (picudosPorHectarea <= 6000) { 
    perdidaEstimada = 0.25;
  } else {
    perdidaEstimada = 0.30;
  }

  return AT*perdidaEstimada;
}
  
const simular =async(nroF,metodo)=>{

  // aca va toda la logica y hay que actualizar los array globales con los resultados

  let EE;
  let PM_PH = [];

  llenarArrays();

  let picudosIniciales = 70;
  let costoPrevencion;

  if(metodo==='TMP'){
    EE = 0.4 + 0.2*rand();
    costoPrevencion = 26;
  } else {
    if(metodo==='DR'){
      EE = 0.2 + 0.2*rand();
      costoPrevencion = 12;
    } else {
      EE = 0;
      costoPrevencion = 0;
    }
  }
  let picudosInicialesSobrevivientes = 0;

  for (let i = 0; i < picudosIniciales; i++) {
    if(rand()>EE){
        picudosInicialesSobrevivientes++;
    }  
  }

  PM_PH = machoOHembra(picudosInicialesSobrevivientes);

  let PH = PM_PH[1];

  //arreglos auxiliares

  const LIMITE_HUEVOS_EN_CELDA = 86000;

  for (let m = 1; m <= 6; m++) {
    if(PH<=3){ 
      PH=5;
    }
    let TPM = normal(temperaturaMeses[m-1][0],temperaturaMeses[m-1][1]);
    let HPM = normal(humedadMeses[m-1][0],humedadMeses[m-1][1]);
    let PAM = 0;

    let indiceHuevos;
    if (TPM <= 20) indiceHuevos = 31;
    else if (TPM <= 25) indiceHuevos = 18;
    else if (TPM <= 30) indiceHuevos = 10;
    else indiceHuevos = 9;
    
    for (let d = 1; d <= 30; d++){
      let NH, HS;
      
      if (HPM <= 60) {
        NH = 5 * PH;
        HS = supervivencia(0.05, NH); //HS = huevos sobrevivientes
      } else if (HPM <= 70) {
        NH = 6 * PH;
        HS = supervivencia(0.2, NH);
      } else {
        NH = 7 * PH;
        HS = supervivencia(0.5, NH);
      }
      
      if (huevos[indiceHuevos] + HS <= LIMITE_HUEVOS_EN_CELDA) {
        huevos[indiceHuevos] += HS;
      } else {
        huevos[indiceHuevos] = LIMITE_HUEVOS_EN_CELDA;
      }

      PM_PH = machoOHembra(huevos[0]); //nacimiento de picudos, asignacion de sexo
      madurosMacho[42] = PM_PH[0];
      madurosHembra[66] = PM_PH[1];
      PAM += huevos[0] - (madurosMacho[0] + madurosHembra[0]);

      actualizarArray(31, huevos);
      actualizarArray(42, madurosMacho);
      actualizarArray(66, madurosHembra);
      PH = picudosVivosHembra();
    
    }

    pam[m-1] = PAM; //picudos adultos del mes
    
    dataMensual[m-1] = {
      'mes': nombresMeses[m-1],
      'temperaturaPromedioMes': TPM,
      'humedadPromedioMes': HPM,
      'picudosAdultosReproductivos': PAM //
    }

    console.log(dataMensual[m-1]);

  }

  console.log("fin");
  console.log(pam);
  
  const PATC = picudosVivosTotales();

  let efectividadFumigacion = 0;

  if(nroF > 0){
    if(nroF <= 2){
      efectividadFumigacion = 0.6 + 0.1 * rand();
    } else if(nroF <= 4){
      efectividadFumigacion = 0.8 + 0.1 * rand();
    } else {
      efectividadFumigacion = 0.9 + 0.05 * rand();
    }
  }

  const costoFumigacion = nroF * 20;

  let PATCS= 0;

  for (let i = 0; i < PATC; i++) {
    if(rand()>efectividadFumigacion){
      PATCS++;
    }
  }

  let AT = 0;
  
  for (let i = 0; i < 200; i++) { 
    /*por cada hectarea se simula la cantidad de plantas,
    y por cada planta se simula el algodon que produce*/
    
    let algodon = Math.floor(60000 + 60000*rand()) + 1;
    let algodonProducidoPlanta;

    for (let i = 0; i < algodon; i++) {
      algodonProducidoPlanta = normal(0.018, 0.004);
      AT+=algodonProducidoPlanta
    }
  }
 
  let picudosPorHectarea = PATCS/300;
  
  console.log("picudos por hectarea: "+picudosPorHectarea);
  
  let ATP = perdidas(picudosPorHectarea, AT);
  

  const costoFijo = 72700;
  const costoVariable = 954;
  const ingresosTotales = 1300 * (AT-ATP)/1000; //pasamos a toneladas el algodon y multiplicamos por el precio por tonelada
  const costoPerdidaPicudo = 1300 * (ATP/1000);

  arrayTorta[0] = Math.round(ingresosTotales);
  arrayTorta[1] = Math.round(costoPerdidaPicudo); //que la torta diga 'Porcentaje de los ingresos perdidos por accion del picudo'
  console.log(arrayTorta);

  const costoTotal = costoFijo + (costoVariable + costoPrevencion + costoFumigacion)*300;
  const beneficio = ingresosTotales - costoTotal;

  arrayBarra[0] = ingresosTotales;
  arrayBarra[1] = costoTotal;
  arrayBarra[2] = beneficio; //que el 2do grafico de barras diga 'Magnitudes y relacion entre: Ingresos, Costos y Ganancias'
  console.log(arrayBarra);

  let rentabilidadMensaje;

  if(beneficio>=0){
    rentabilidadMensaje = "La estrategia de control es rentable";
  } else {
    rentabilidadMensaje = "La estrategia de control no es rentable";
  }

  dataCard = {
    'picudosVivosTotalesFinales': PATCS,
    'ingresosTotales': ingresosTotales,
    'danoProvocado': costoPerdidaPicudo,
    'costoMetodoPreventivo': costoPrevencion*300,
    'costoFumigacion': costoFumigacion*300,
    'costoTotal': costoTotal,
    'beneficio': beneficio,
    'rentabilidadMensaje': rentabilidadMensaje
  }

  console.log(dataCard);
}
