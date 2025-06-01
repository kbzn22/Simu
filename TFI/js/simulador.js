var arrayLinea=[]; 
var arrayBarra=[];
var arrayTorta=[];
var dataCard=[];

const iniciar =()=>{
    var nroF= document.getElementById("numberF").value;
    var metodo= document.getElementById("typeF").value;
    simular(nroF,metodo);
    actualizar(); 
    
}

const simular =(nroF,metodo)=>{

    // aca va toda la logica y hay que actualizar los array globales con los resultados

    arrayLinea=[3455, 4566, 6251, 7841, 9821, 16000]; 
    arrayBarra=[100000,5000,3,4,5,6];
    arrayTorta=[65,35];
    dataCard=[76,79,90]
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