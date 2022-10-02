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


function ordenar(){
    if(estaOrdenado) return;
    estaOrdenado = OrdenarLista(arr);
    reImprimir(arr);}


function reImprimir(array){
    textArea.value ='';
    array.forEach((val, idx)=> {
        textArea.value += idx == (array.length - 1) ? val :`${val} `;});}


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
    mostrarRes.innerText = Promedio(arr);}


function calcModa(){
    if(!arr || !arr.length) return;
    ordenar();
    mostrarRes.innerText = Moda(arr).val;}


function calcMedia(){
    if(!arr || !arr.length) return;
    ordenar();
    mostrarRes.innerText = Media(arr);}