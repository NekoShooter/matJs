const precio = document.querySelector('#precio');
const cupon = document.querySelector('#cupon');
const resultado = document.querySelector('#resultado');
const form = document.querySelector('.formulario');

form.addEventListener('submit', submit);

const ListaDeCupones = new Array();

ListaDeCupones.push({codigo: 'abc20', descuento : 20});
ListaDeCupones.push({codigo: 'xyz50', descuento : 50});
ListaDeCupones.push({codigo: 'blackFriday', descuento : 15});

function submit(event){
    event.preventDefault();
    let precioFinal = precio.value;
    if(!precioFinal) {
        resultado.innerText = 'por favor ingresa un precio';
        return;}
    precioFinal = calcDescuento();

    if(precioFinal == precio.value && cupon.value != ''){
        resultado.innerText =`cupon ${cupon.value} invalido`;
        return;}
    resultado.innerText = `total a pagar: \$${precioFinal}`;}

function calcDescuento(){
    let descuento = 0;
    if(cupon.value != ''){
        const int = Number(cupon.value);
        if(isNaN(int)) {
            const cuponValido = buscarDescuento();
            if(cuponValido) descuento = cuponValido.descuento;}
        else descuento = int;}
        
    return (precio.value * (100 - descuento))/ 100; }

function validarCupon(cuponIngresado){ return cuponIngresado.codigo == cupon.value;}

function buscarDescuento(){ return ListaDeCupones.find(validarCupon);}