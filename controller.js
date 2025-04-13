const openTab = (tabName) => {
    const tabs = document.getElementsByClassName('tab'); //busca los divs con clase 'tab'
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active'); //oculta todos los tabs
    }
    document.getElementById(tabName).classList.add('active'); //muestra el seleccionado
}