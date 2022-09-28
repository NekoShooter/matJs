const textArea = document.querySelector('textarea');
const mostrarRes = document.querySelector('.resultado');
const btnPromedio = document.querySelector('.calcPromedio');
const btnMedia = document.querySelector('.calcMedia');
const btnModa = document.querySelector('.calcModa');

let arr = obtenerArray();
let estaOrdenado = Boolean(false);

textArea.addEventListener('input', actualizar)
btnPromedio.addEventListener('click', calcPromedio);
btnMedia.addEventListener('click', calcMedia);
btnModa.addEventListener('click', calcModa);


function actualizar(){
    estaOrdenado = false;
    arr = obtenerArray();
    mostrarRes.innerText ='';}


function esImpar(array){ return array.length %2;}


function ordenar(){
    if(estaOrdenado || !arr) return;
    if(arr.length){
        sort(arr, 0 , arr.length - 1);
        reImprimir(arr);
        estaOrdenado = true;}}


function reImprimir(array){
    textArea.value ='';
    array.forEach((val, idx)=> {
        textArea.value += idx == (array.length - 1) ? val :`${val} `;});}


function sort(array, ini, fin){
    let izq = ini;
    let der = fin;
    let piv = array[~~((der + izq) / 2)];

    do{
        while (array[izq] < piv && izq < fin) ++izq;
        while (array[der] > piv && der > ini) --der;

        if(izq <= der){
            const tmp = array[izq];
            array[izq] = array[der];
            array[der] = tmp;
            ++izq;
            --der;}

    }while(izq <= der);

    if(ini < der) sort(array, ini ,der);
    if(fin > izq) sort(array, izq, fin);}


function obtenerArray(){
    let array = textArea.value.split(',');
    const num = Array();
    if(array.length == 1){ 
        if(array[0] == '') return undefined;
        array = array[0].split(' ');}
    validarNum(num, array);
    return num}


function validarNum(arrNum, array){
    if(array.length == 1 && array[0] =='') return;
    array.forEach(val =>{
        if(val.includes(' ')){
            arr_val = val.split(' ');
            validarNum(arrNum, arr_val);}
        else if(val != '' && val != '\n'){
            const int = Number(val);
            if(!isNaN(int)) arrNum.push(int);}});}


function calcPromedio(){
    if(!arr || !arr.length) return;
    let res = arr.reduce((vacum, vres) => vacum + vres);
    mostrarRes.innerText = (res / arr.length).toFixed(1);}


function calcModa(){
    if(!arr || !arr.length) return;
    ordenar();
    let cont = 0;
    const moda = {moda : 0, rep : 0}
    let valActual = arr[0];
    arr.forEach(val =>{
        if(valActual == val) cont++;
        else if(moda.rep < cont){
            moda.moda = valActual;
            moda.rep = cont;}
        else cont = 1;
        valActual = val;});
    mostrarRes.innerText = moda.moda;}


function calcMedia(){
    if(!arr || !arr.length) return;
    ordenar();
    const med = ~~(arr.length / 2);
    if(esImpar(arr)) mostrarRes.innerText = arr[med];
    else mostrarRes.innerText = ((arr[med] + arr[med - 1]) / 2).toFixed(1);}

